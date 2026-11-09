import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../hooks/useReducedMotion';

// A live, flowing colour field for the hero stage, drawn by one small WebGL shader: four colours
// folded into each other by layered sine waves, with a soft light that follows the pointer.
// It renders at a fraction of screen resolution (the picture is soft anyway), starts once the
// page is idle, only on a real GPU, and stops while the hero is off screen or the tab is hidden. Without WebGL, or
// with reduced motion, the CSS gradient underneath stays on its own.

const VERT = 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';
const FRAG = `
precision mediump float;
uniform vec2 r; uniform float t; uniform vec2 m;
const vec3 c0 = vec3(.043, .039, .122);  // navy night
const vec3 c1 = vec3(.40, .16, .82);     // violet
const vec3 c2 = vec3(.15, .36, .92);     // electric blue
const vec3 c3 = vec3(.03, .62, .80);     // cyan (thin highlight)
const vec3 c4 = vec3(.58, .30, 1.);      // lilac
void main() {
  vec2 p = gl_FragCoord.xy / r;
  float k = r.x / r.y;
  vec2 q = vec2(p.x * k, p.y) * 1.4;
  float s = t * .07;
  q += .45 * vec2(sin(q.y * 1.9 + s * 3.1), cos(q.x * 1.6 - s * 2.3));
  q += .28 * vec2(sin(q.y * 3.1 - s * 2.2 + 1.7), cos(q.x * 2.7 + s * 1.6));
  float a = .5 + .5 * sin(q.x * 1.7 + s * 1.3);
  float b = .5 + .5 * cos(q.y * 2.1 - s * 1.1 + q.x * .6);
  float c = .5 + .5 * sin((q.x - q.y) * 1.5 + s * .9);
  vec3 col = mix(c0, c1, smoothstep(.25, 1., a) * .85);
  col = mix(col, c2, smoothstep(.5, 1., b) * .55);
  col = mix(col, c3, smoothstep(.88, 1., c) * .4);
  col = mix(col, c4, smoothstep(.8, 1., a * b) * .35);
  // darker towards the middle and the bottom, where the text sits
  vec2 d = p - vec2(.5, .48);
  col *= .62 + .38 * smoothstep(.0, .55, length(d * vec2(1.2, 1.6)));
  col *= .78 + .22 * smoothstep(.0, .5, p.y);
  // pointer light
  vec2 pm = (p - m) * vec2(k, 1.);
  col += vec3(.55, .45, 1.) * .22 * exp(-dot(pm, pm) * 7.);
  // fine grain, so the gradient never bands
  col += (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - .5) * .018;
  gl_FragColor = vec4(col, 1.);
}`;

export default function HeroCanvas({ stageRef }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const stage = stageRef.current;
    // Phones keep the CSS gradient: it looks the same at that size and costs nothing.
    if (!canvas || !stage || prefersReducedMotion() || !window.matchMedia('(min-width: 901px)').matches) return undefined;
    let gl, raf = 0, visible = true, alive = true, start = 0;
    const mouse = [0.5, 0.62], target = [0.5, 0.62];

    const setup = () => {
      if (!alive) return;
      gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power', preserveDrawingBuffer: false, failIfMajorPerformanceCaveat: true });
      if (!gl) return;
      // Software rendering (no GPU) would run the shader on the CPU: keep the CSS gradient instead.
      const info = gl.getExtension('WEBGL_debug_renderer_info');
      if (info && /swiftshader|llvmpipe|software|basic render/i.test(gl.getParameter(info.UNMASKED_RENDERER_WEBGL))) {
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return;
      }
      const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
      const prog = gl.createProgram();
      gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
      gl.useProgram(prog);
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, 'a');
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      const uR = gl.getUniformLocation(prog, 'r');
      const uT = gl.getUniformLocation(prog, 't');
      const uM = gl.getUniformLocation(prog, 'm');

      const size = () => {
        const scale = 0.5;
        canvas.width = Math.max(2, Math.round(canvas.clientWidth * scale));
        canvas.height = Math.max(2, Math.round(canvas.clientHeight * scale));
        gl.viewport(0, 0, canvas.width, canvas.height);
      };
      size();
      start = performance.now() - 20000; // start mid-flow, not at the plain first frame
      const draw = (now) => {
        raf = 0;
        mouse[0] += (target[0] - mouse[0]) * 0.05;
        mouse[1] += (target[1] - mouse[1]) * 0.05;
        gl.uniform2f(uR, canvas.width, canvas.height);
        gl.uniform1f(uT, (now - start) / 1000);
        gl.uniform2f(uM, mouse[0], mouse[1]);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        if (visible && !document.hidden) raf = requestAnimationFrame(draw);
      };
      const resume = () => { if (!raf && visible && !document.hidden) raf = requestAnimationFrame(draw); };
      const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; resume(); });
      io.observe(stage);
      const onMove = (e) => {
        const b = stage.getBoundingClientRect();
        target[0] = (e.clientX - b.left) / b.width;
        target[1] = 1 - (e.clientY - b.top) / b.height;
      };
      stage.addEventListener('pointermove', onMove, { passive: true });
      document.addEventListener('visibilitychange', resume);
      window.addEventListener('resize', size);
      raf = requestAnimationFrame((n) => { draw(n); canvas.classList.add('is-on'); });
      cleanup = () => {
        io.disconnect();
        stage.removeEventListener('pointermove', onMove);
        document.removeEventListener('visibilitychange', resume);
        window.removeEventListener('resize', size);
        gl.getExtension('WEBGL_lose_context')?.loseContext();
      };
    };

    let cleanup = () => {};
    const idle = window.requestIdleCallback ? requestIdleCallback(setup, { timeout: 1500 }) : setTimeout(setup, 300);
    return () => {
      alive = false;
      (window.cancelIdleCallback || clearTimeout)(idle);
      cancelAnimationFrame(raf);
      cleanup();
    };
  }, [stageRef]);

  return <canvas ref={ref} className="stage-gl" aria-hidden="true" />;
}
