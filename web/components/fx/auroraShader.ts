/**
 * WebGL2 aurora shader: a curved "bridge band" of light — the Bifrost myth,
 * a shimmering wavering road. Mounted post-idle on top of the permanent CSS
 * gradient layers (transparent framebuffer, premultiplied alpha composites
 * over them). If anything fails to init, the caller just keeps the CSS layer.
 */

const VERT = `#version 300 es
// Fullscreen triangle straight from gl_VertexID — no attribute buffers needed.
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;

uniform vec2 u_res;
uniform float u_time;
uniform float u_intensity;
uniform vec2 u_mouse;

out vec4 fragColor;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

// Two octaves, no loop — the only fbm in the shader.
float fbm(vec2 p) {
  return vnoise(p) * 0.65 + vnoise(p * 2.13 + 17.7) * 0.35;
}

// Five-stop spectral ramp #7c5cff -> #4f9dff -> #46e6d0 -> #ffd27a -> #ff7ac8,
// chained mix+smoothstep rather than an HSV roundtrip.
vec3 ramp(float s) {
  vec3 c = mix(vec3(0.486, 0.361, 1.000), vec3(0.310, 0.616, 1.000), smoothstep(0.00, 0.25, s));
  c = mix(c, vec3(0.275, 0.902, 0.816), smoothstep(0.25, 0.50, s));
  c = mix(c, vec3(1.000, 0.824, 0.478), smoothstep(0.50, 0.75, s));
  c = mix(c, vec3(1.000, 0.478, 0.784), smoothstep(0.75, 1.00, s));
  return c;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;   // 0-1, y up
  vec2 par = (u_mouse - 0.5) * 0.04;   // pointer parallax, +-0.02 uv

  // Band center: a gentle quadratic arc across the upper third of the screen.
  float x = clamp(uv.x + par.x, 0.0, 1.0);
  float yc = 0.18 * (x - 0.5) * (x - 0.5) + 0.71 + par.y;

  // Wavering: the band's width breathes with fbm scrolled slowly along the road.
  float n1 = fbm(vec2(x * 3.0 - u_time * 0.03, u_time * 0.02));
  float w = 0.05 + 0.018 * n1;

  float d = uv.y - yc;
  float band = exp(-(d * d) / (w * w));

  // Shimmer: light runs ALONG the road as dash-like streaks.
  float shimmer = 0.75 + 0.35 * vnoise(vec2(x * 6.0 - u_time * 0.35, uv.y * 3.0));

  // Spectral color flows along the road.
  float s = fract(x * 0.9 + u_time * 0.015);
  vec3 core = ramp(s) * band * shimmer;

  // Broad under-glow haze beneath the band only, indigo/teal (ramp stops 2-3, dimmed).
  float below = yc - uv.y;
  vec3 glowTint = mix(vec3(0.310, 0.616, 1.000), vec3(0.275, 0.902, 0.816), x) * 0.6;
  float glow = below > 0.0 ? exp(-below * 3.0) * 0.25 : 0.0;

  vec3 col = (core + glowTint * glow) * u_intensity;

  // 1/255 dither kills gradient banding on the smooth falloffs.
  float n = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
  col = clamp(col + (n - 0.5) / 255.0, 0.0, 1.0);

  // Premultiplied alpha: low-alpha fragments stay bright, so the band glows
  // over the CSS layers beneath instead of washing them out.
  fragColor = vec4(col, max(max(col.r, col.g), col.b));
}`;

export function mountAurora(host: HTMLElement): () => void {
  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  const s = canvas.style;
  s.position = "absolute";
  s.inset = "0";
  s.width = "100%";
  s.height = "100%";

  let gl: WebGL2RenderingContext | null = null;
  let prog: WebGLProgram | null = null;
  const uniforms: Record<string, WebGLUniformLocation | null> = {};
  let raf = 0;
  let tick = 0;
  let time = 0;
  let last = 0;
  let intensity = 0.85;
  let target = 0.85;
  let disposed = false;
  const mouse = [0.5, 0.5];

  /** Compile + link; safe to call again after a context restore. */
  function init(): boolean {
    try {
      gl = canvas.getContext("webgl2", {
        alpha: true,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: "low-power",
      });
      if (!gl) return false;
      const compile = (type: number, src: string) => {
        const sh = gl!.createShader(type)!;
        gl!.shaderSource(sh, src);
        gl!.compileShader(sh);
        if (!gl!.getShaderParameter(sh, gl!.COMPILE_STATUS)) throw new Error(gl!.getShaderInfoLog(sh) ?? "shader");
        return sh;
      };
      prog = gl.createProgram()!;
      gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) ?? "link");
      for (const name of ["u_time", "u_res", "u_intensity", "u_mouse"])
        uniforms[name] = gl.getUniformLocation(prog, name);
      return true;
    } catch (err) {
      console.warn("aurora: shader init failed, staying on CSS layer", err);
      return false;
    }
  }

  function draw(dt: number) {
    if (!gl || !prog) return;
    time += dt;
    const w = Math.max(1, Math.round(canvas.clientWidth * scale()));
    const h = Math.max(1, Math.round(canvas.clientHeight * scale()));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
    gl.useProgram(prog);
    gl.uniform1f(uniforms.u_time!, time);
    gl.uniform2f(uniforms.u_res!, w, h);
    gl.uniform1f(uniforms.u_intensity!, intensity);
    gl.uniform2f(uniforms.u_mouse!, mouse[0], mouse[1]);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  // 30fps: render every other rAF tick; easing still runs on the cheap ticks.
  function loop(now: number) {
    raf = requestAnimationFrame(loop);
    const dt = Math.min((now - last) / 1000, 0.1);
    last = now;
    // ~2s settle toward the intensity target (0.85 on tab-hero, 0.3 elsewhere).
    intensity += (target - intensity) * (1 - Math.exp(-dt * 2.5));
    if (tick++ % 2 === 0) draw(dt);
  }

  function start() {
    if (disposed || raf) return;
    last = performance.now();
    raf = requestAnimationFrame(loop);
  }

  function stop() {
    cancelAnimationFrame(raf);
    raf = 0;
  }

  // Render scale: cap DPR, then downsample — the effect is soft, 0.66x is plenty.
  function scale(): number {
    return Math.min(window.devicePixelRatio || 1, 1.5) * 0.66;
  }

  const onVisibility = () => (document.hidden ? stop() : start());
  const onTabChange = (e: Event) => {
    target = (e as CustomEvent<string>).detail === "tab-hero" ? 0.85 : 0.3;
  };
  const onPointerMove = (e: PointerEvent) => {
    mouse[0] = e.clientX / window.innerWidth;
    mouse[1] = 1 - e.clientY / window.innerHeight;
  };
  const onContextLost = (e: Event) => {
    // Let the browser know we can rebuild; drop to the CSS layer meanwhile.
    e.preventDefault();
    stop();
    canvas.remove();
  };
  const onContextRestored = () => {
    if (disposed) return;
    if (init()) {
      host.appendChild(canvas);
      tick = 0;
      start();
    }
  };

  if (!init()) {
    canvas.remove();
    return () => {};
  }

  host.appendChild(canvas);
  // The pre-paint tab restore mutates the DOM without dispatching
  // bifrost:tabchange, so read the active section directly: a restored
  // non-hero tab must start dimmed, not at full hero intensity.
  if (document.querySelector<HTMLElement>("[data-tab-section].is-active")?.id !== "tab-hero") {
    intensity = 0.3;
    target = 0.3;
  }
  window.addEventListener("visibilitychange", onVisibility);
  window.addEventListener("bifrost:tabchange", onTabChange);
  window.addEventListener("pointermove", onPointerMove, { passive: true });
  canvas.addEventListener("webglcontextlost", onContextLost);
  canvas.addEventListener("webglcontextrestored", onContextRestored);
  start();

  return () => {
    disposed = true;
    stop();
    window.removeEventListener("visibilitychange", onVisibility);
    window.removeEventListener("bifrost:tabchange", onTabChange);
    window.removeEventListener("pointermove", onPointerMove);
    canvas.removeEventListener("webglcontextlost", onContextLost);
    canvas.removeEventListener("webglcontextrestored", onContextRestored);
    canvas.remove();
    // Release the GPU context so the browser can reclaim it.
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  };
}