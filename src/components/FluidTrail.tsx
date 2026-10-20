"use client";

import { useEffect, useRef } from "react";

export type FluidTrailProps = {
  global?: boolean;
  simRes?: number;
  dyeRes?: number;
  densityDissipation?: number;
  velocityDissipation?: number;
  pressure?: number;
  curl?: number;
  splatRadius?: number;
  splatForce?: number;
  intensity?: number;
  gain?: number;
  gradientLength?: number;
  colors?: readonly [string, string];
};

type PointerPoint = {
  x: number;
  y: number;
};

type Target = {
  texture: WebGLTexture;
  framebuffer: WebGLFramebuffer;
  width: number;
  height: number;
};

type DoubleTarget = {
  read: Target;
  write: Target;
};

type Targets = {
  velocity: DoubleTarget;
  dye: DoubleTarget;
  pressure: DoubleTarget;
  divergence: Target;
  curl: Target;
  all: Target[];
};

type Programs = {
  curl: WebGLProgram;
  vorticity: WebGLProgram;
  divergence: WebGLProgram;
  pressure: WebGLProgram;
  gradient: WebGLProgram;
  splatVelocity: WebGLProgram;
  splatDye: WebGLProgram;
  advectVelocity: WebGLProgram;
  advectDye: WebGLProgram;
  render: WebGLProgram;
  all: WebGLProgram[];
};

const DEFAULT_COLORS: readonly [string, string] = ["#2F5BFF", "#EF6D28"];

const VERTEX_SHADER = `#version 300 es
precision highp float;
out vec2 vUv;
void main () {
  vec2 position = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  vUv = position;
  gl_Position = vec4(position * 2.0 - 1.0, 0.0, 1.0);
}`;

const CURL_SHADER = `#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uVelocity;
uniform vec2 uTexelSize;
out vec4 outColor;
void main () {
  float left = texture(uVelocity, vUv - vec2(uTexelSize.x, 0.0)).y;
  float right = texture(uVelocity, vUv + vec2(uTexelSize.x, 0.0)).y;
  float bottom = texture(uVelocity, vUv - vec2(0.0, uTexelSize.y)).x;
  float top = texture(uVelocity, vUv + vec2(0.0, uTexelSize.y)).x;
  outColor = vec4((right - left - top + bottom) * 0.5, 0.0, 0.0, 1.0);
}`;

const VORTICITY_SHADER = `#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uVelocity;
uniform sampler2D uCurl;
uniform vec2 uTexelSize;
uniform float uCurlStrength;
uniform float uDt;
out vec4 outColor;
void main () {
  float left = abs(texture(uCurl, vUv - vec2(uTexelSize.x, 0.0)).r);
  float right = abs(texture(uCurl, vUv + vec2(uTexelSize.x, 0.0)).r);
  float bottom = abs(texture(uCurl, vUv - vec2(0.0, uTexelSize.y)).r);
  float top = abs(texture(uCurl, vUv + vec2(0.0, uTexelSize.y)).r);
  float center = texture(uCurl, vUv).r;
  vec2 force = 0.5 * vec2(top - bottom, right - left);
  force /= length(force) + 0.0001;
  force *= uCurlStrength * center;
  force.y *= -1.0;
  vec2 velocity = texture(uVelocity, vUv).xy + force * uDt;
  outColor = vec4(velocity, 0.0, 1.0);
}`;

const DIVERGENCE_SHADER = `#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uVelocity;
uniform vec2 uTexelSize;
out vec4 outColor;
void main () {
  float left = texture(uVelocity, vUv - vec2(uTexelSize.x, 0.0)).x;
  float right = texture(uVelocity, vUv + vec2(uTexelSize.x, 0.0)).x;
  float bottom = texture(uVelocity, vUv - vec2(0.0, uTexelSize.y)).y;
  float top = texture(uVelocity, vUv + vec2(0.0, uTexelSize.y)).y;
  outColor = vec4((right - left + top - bottom) * 0.5, 0.0, 0.0, 1.0);
}`;

const PRESSURE_SHADER = `#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uPressure;
uniform sampler2D uDivergence;
uniform vec2 uTexelSize;
uniform float uPressureDissipation;
out vec4 outColor;
void main () {
  float left = texture(uPressure, vUv - vec2(uTexelSize.x, 0.0)).r;
  float right = texture(uPressure, vUv + vec2(uTexelSize.x, 0.0)).r;
  float bottom = texture(uPressure, vUv - vec2(0.0, uTexelSize.y)).r;
  float top = texture(uPressure, vUv + vec2(0.0, uTexelSize.y)).r;
  float divergence = texture(uDivergence, vUv).r;
  outColor = vec4((left + right + bottom + top - divergence) * 0.25 * uPressureDissipation, 0.0, 0.0, 1.0);
}`;

const GRADIENT_SHADER = `#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uVelocity;
uniform sampler2D uPressure;
uniform vec2 uTexelSize;
out vec4 outColor;
void main () {
  float left = texture(uPressure, vUv - vec2(uTexelSize.x, 0.0)).r;
  float right = texture(uPressure, vUv + vec2(uTexelSize.x, 0.0)).r;
  float bottom = texture(uPressure, vUv - vec2(0.0, uTexelSize.y)).r;
  float top = texture(uPressure, vUv + vec2(0.0, uTexelSize.y)).r;
  vec2 velocity = texture(uVelocity, vUv).xy - 0.5 * vec2(right - left, top - bottom);
  outColor = vec4(velocity, 0.0, 1.0);
}`;

const SPLAT_VELOCITY_SHADER = `#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uTarget;
uniform vec2 uPoint;
uniform vec2 uDelta;
uniform float uRadius;
uniform float uAspect;
uniform float uForce;
out vec4 outColor;
void main () {
  vec2 p = vUv - uPoint;
  p.x *= uAspect;
  float splat = exp(-dot(p, p) / uRadius);
  vec2 velocity = texture(uTarget, vUv).xy + uDelta * uForce * splat;
  outColor = vec4(velocity, 0.0, 1.0);
}`;

const SPLAT_DYE_SHADER = `#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uTarget;
uniform vec2 uPoint;
uniform float uRadius;
uniform float uAspect;
uniform vec3 uColor;
uniform float uIntensity;
out vec4 outColor;
void main () {
  vec2 p = vUv - uPoint;
  p.x *= uAspect;
  float w = exp(-dot(p, p) / uRadius);
  vec4 src = vec4(uColor, 1.0) * w * uIntensity;
  vec4 base = texture(uTarget, vUv);
  outColor = src + base * (1.0 - src.a);
}`;

const ADVECT_VELOCITY_SHADER = `#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uVelocity;
uniform float uDt;
uniform float uDissipation;
out vec4 outColor;
void main () {
  vec2 velocity = texture(uVelocity, vUv).xy;
  vec2 backtrace = vUv - velocity * uDt;
  velocity = texture(uVelocity, backtrace).xy;
  velocity *= exp(-uDt * max(uDissipation, 0.0));
  outColor = vec4(velocity, 0.0, 1.0);
}`;

const ADVECT_DYE_SHADER = `#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uDye;
uniform sampler2D uVelocity;
uniform float uDt;
uniform float uDissipation;
out vec4 outColor;
void main () {
  vec2 velocity = texture(uVelocity, vUv).xy;
  vec2 backtrace = vUv - velocity * uDt;
  vec4 dye = texture(uDye, backtrace);
  dye *= exp(-uDt * max(uDissipation, 0.0) * 2.0);
  outColor = dye;
}`;

const RENDER_SHADER = `#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uDye;
uniform float uGain;
out vec4 outColor;
void main () {
  vec4 c = texture(uDye, vUv);
  float a = clamp(c.a * uGain, 0.0, 1.0);
  a = min(smoothstep(0.0, 1.0, a), 0.85);
  vec3 hue = c.rgb / max(c.a, 0.0001);
  vec2 texel = 1.0 / vec2(textureSize(uDye, 0));
  float left = texture(uDye, vUv - vec2(texel.x, 0.0)).a;
  float right = texture(uDye, vUv + vec2(texel.x, 0.0)).a;
  float bottom = texture(uDye, vUv - vec2(0.0, texel.y)).a;
  float top = texture(uDye, vUv + vec2(0.0, texel.y)).a;
  float rim = clamp(length(vec2(right - left, top - bottom)) * 12.0, 0.0, 1.0);
  float inkAlpha = min(a * 0.62 + rim * 0.1, 0.78);
  float softness = clamp(0.28 + rim * 0.38, 0.0, 0.7);
  vec3 ink = mix(hue, vec3(1.0), softness);
  outColor = vec4(ink * inkAlpha, inkAlpha);
}`;

function parseColor(color: string, fallback: readonly [number, number, number]): [number, number, number] {
  const hex = color.trim().replace(/^#/, "");
  const expanded = hex.length === 3 ? hex.split("").map((part) => part + part).join("") : hex;
  if (!/^[\da-fA-F]{6}$/.test(expanded)) return [...fallback];
  return [
    Number.parseInt(expanded.slice(0, 2), 16) / 255,
    Number.parseInt(expanded.slice(2, 4), 16) / 255,
    Number.parseInt(expanded.slice(4, 6), 16) / 255,
  ];
}

function createProgram(gl: WebGL2RenderingContext, fragmentSource: string): WebGLProgram | null {
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  if (!vertexShader || !fragmentShader) return null;

  gl.shaderSource(vertexShader, VERTEX_SHADER);
  gl.shaderSource(fragmentShader, fragmentSource);
  gl.compileShader(vertexShader);
  gl.compileShader(fragmentShader);

  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS) || !gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    return null;
  }

  const program = gl.createProgram();
  if (!program) {
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    return null;
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

function createTarget(
  gl: WebGL2RenderingContext,
  width: number,
  height: number,
  internalFormat: number,
  format: number,
): Target | null {
  const texture = gl.createTexture();
  const framebuffer = gl.createFramebuffer();
  if (!texture || !framebuffer) {
    if (texture) gl.deleteTexture(texture);
    if (framebuffer) gl.deleteFramebuffer(framebuffer);
    return null;
  }

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, width, height, 0, format, gl.HALF_FLOAT, null);
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

  if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
    gl.deleteTexture(texture);
    gl.deleteFramebuffer(framebuffer);
    return null;
  }
  return { texture, framebuffer, width, height };
}

function destroyTarget(gl: WebGL2RenderingContext, target: Target): void {
  gl.deleteTexture(target.texture);
  gl.deleteFramebuffer(target.framebuffer);
}

function createTargets(gl: WebGL2RenderingContext, simWidth: number, simHeight: number, dyeWidth: number, dyeHeight: number): Targets | null {
  const all: Target[] = [];
  const make = (width: number, height: number, internalFormat: number, format: number): Target | null => {
    const target = createTarget(gl, width, height, internalFormat, format);
    if (target) all.push(target);
    return target;
  };
  const velocityRead = make(simWidth, simHeight, gl.RG16F, gl.RG);
  const velocityWrite = make(simWidth, simHeight, gl.RG16F, gl.RG);
  const dyeRead = make(dyeWidth, dyeHeight, gl.RGBA16F, gl.RGBA);
  const dyeWrite = make(dyeWidth, dyeHeight, gl.RGBA16F, gl.RGBA);
  const pressureRead = make(simWidth, simHeight, gl.R16F, gl.RED);
  const pressureWrite = make(simWidth, simHeight, gl.R16F, gl.RED);
  const divergence = make(simWidth, simHeight, gl.R16F, gl.RED);
  const curl = make(simWidth, simHeight, gl.R16F, gl.RED);

  if (!velocityRead || !velocityWrite || !dyeRead || !dyeWrite || !pressureRead || !pressureWrite || !divergence || !curl) {
    all.forEach((target) => destroyTarget(gl, target));
    return null;
  }
  return {
    velocity: { read: velocityRead, write: velocityWrite },
    dye: { read: dyeRead, write: dyeWrite },
    pressure: { read: pressureRead, write: pressureWrite },
    divergence,
    curl,
    all,
  };
}

function destroyTargets(gl: WebGL2RenderingContext, targets: Targets): void {
  targets.all.forEach((target) => destroyTarget(gl, target));
}

function swap(target: DoubleTarget): void {
  [target.read, target.write] = [target.write, target.read];
}

function setTexture(gl: WebGL2RenderingContext, program: WebGLProgram, name: string, texture: WebGLTexture, unit: number): void {
  gl.activeTexture(gl.TEXTURE0 + unit);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  const location = gl.getUniformLocation(program, name);
  if (location) gl.uniform1i(location, unit);
}

function set1f(gl: WebGL2RenderingContext, program: WebGLProgram, name: string, value: number): void {
  const location = gl.getUniformLocation(program, name);
  if (location) gl.uniform1f(location, value);
}

function set2f(gl: WebGL2RenderingContext, program: WebGLProgram, name: string, x: number, y: number): void {
  const location = gl.getUniformLocation(program, name);
  if (location) gl.uniform2f(location, x, y);
}

function set3f(gl: WebGL2RenderingContext, program: WebGLProgram, value: readonly [number, number, number]): void {
  const location = gl.getUniformLocation(program, "uColor");
  if (location) gl.uniform3f(location, value[0], value[1], value[2]);
}

type OklabColor = readonly [number, number, number];

function linearize(channel: number): number {
  return channel <= 0.04045 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
}

function encodeSrgb(channel: number): number {
  const clamped = Math.min(1, Math.max(0, channel));
  return clamped <= 0.0031308 ? clamped * 12.92 : 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055;
}

function toOklab(color: readonly [number, number, number]): OklabColor {
  const red = linearize(color[0]);
  const green = linearize(color[1]);
  const blue = linearize(color[2]);
  const l = Math.cbrt(0.4122214708 * red + 0.5363325363 * green + 0.0514459929 * blue);
  const m = Math.cbrt(0.2119034982 * red + 0.6806995451 * green + 0.1073969566 * blue);
  const s = Math.cbrt(0.0883024619 * red + 0.2817188376 * green + 0.6299787005 * blue);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

function fromOklab([lightness, a, b]: OklabColor): [number, number, number] {
  const l = Math.pow(lightness + 0.3963377774 * a + 0.2158037573 * b, 3);
  const m = Math.pow(lightness - 0.1055613458 * a - 0.0638541728 * b, 3);
  const s = Math.pow(lightness - 0.0894841775 * a - 1.291485548 * b, 3);
  return [
    encodeSrgb(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    encodeSrgb(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    encodeSrgb(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ];
}

function mixColorsOklab(
  from: readonly [number, number, number],
  to: readonly [number, number, number],
  amount: number,
): [number, number, number] {
  if (amount <= 0) return [...from];
  if (amount >= 1) return [...to];

  const fromLab = toOklab(from);
  const toLab = toOklab(to);
  const fromChroma = Math.hypot(fromLab[1], fromLab[2]);
  const toChroma = Math.hypot(toLab[1], toLab[2]);
  const fromHue = Math.atan2(fromLab[2], fromLab[1]);
  const toHue = Math.atan2(toLab[2], toLab[1]);
  const hueDelta = Math.atan2(Math.sin(toHue - fromHue), Math.cos(toHue - fromHue));
  const interpolatedChroma = fromChroma + (toChroma - fromChroma) * amount;
  const chroma = Math.max(interpolatedChroma, (fromChroma + toChroma) * 0.5);
  const hue = fromHue + hueDelta * amount;

  return fromOklab([
    fromLab[0] + (toLab[0] - fromLab[0]) * amount,
    Math.cos(hue) * chroma,
    Math.sin(hue) * chroma,
  ]);
}

function draw(gl: WebGL2RenderingContext, program: WebGLProgram, target: Target | null): void {
  gl.bindFramebuffer(gl.FRAMEBUFFER, target?.framebuffer ?? null);
  gl.viewport(0, 0, target?.width ?? gl.drawingBufferWidth, target?.height ?? gl.drawingBufferHeight);
  gl.useProgram(program);
}

export default function FluidTrail({
  global = false,
  simRes = 128,
  dyeRes = 1024,
  densityDissipation = 2.0,
  velocityDissipation = 1.2,
  pressure = 0.6,
  curl = 6,
  splatRadius = 0.3,
  splatForce = 6000,
  intensity = 0.45,
  gain = 1.1,
  gradientLength = 0.6,
  colors = DEFAULT_COLORS,
}: FluidTrailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = global ? document.documentElement : canvas?.parentElement;
    if (!canvas || !section) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    const gl = canvas.getContext("webgl2", {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
    });
    if (!gl) return;
    if (!gl.getExtension("EXT_color_buffer_float")) {
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      return;
    }

    const programEntries = [
      ["curl", CURL_SHADER],
      ["vorticity", VORTICITY_SHADER],
      ["divergence", DIVERGENCE_SHADER],
      ["pressure", PRESSURE_SHADER],
      ["gradient", GRADIENT_SHADER],
      ["splatVelocity", SPLAT_VELOCITY_SHADER],
      ["splatDye", SPLAT_DYE_SHADER],
      ["advectVelocity", ADVECT_VELOCITY_SHADER],
      ["advectDye", ADVECT_DYE_SHADER],
      ["render", RENDER_SHADER],
    ] as const;
    const compiled: WebGLProgram[] = [];
    const programs = {} as Programs;
    for (const [name, source] of programEntries) {
      const program = createProgram(gl, source);
      if (!program) {
        compiled.forEach((item) => gl.deleteProgram(item));
        gl.getExtension("WEBGL_lose_context")?.loseContext();
        return;
      }
      programs[name] = program;
      compiled.push(program);
    }
    programs.all = compiled;

    const palette: readonly [readonly [number, number, number], readonly [number, number, number]] = [
      parseColor(colors[0], [47 / 255, 91 / 255, 1]),
      parseColor(colors[1], [239 / 255, 109 / 255, 40 / 255]),
    ];
    let targets: Targets | null = null;
    let simWidth = 0;
    let simHeight = 0;
    let dyeWidth = 0;
    let dyeHeight = 0;
    let frameId = 0;
    let lastFrame = 0;
    let visible = false;
    let latestPointer: PointerPoint | null = null;
    let pendingPointerPoints: PointerPoint[] = [];
    let previousPointerX = 0;
    let previousPointerY = 0;
    let hasPreviousPointer = false;
    let strokeDistance = 0;

    const resize = (): boolean => {
      const rect = global
        ? {
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight,
          }
        : section.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.max(1, Math.round(rect.width * pixelRatio));
      const height = Math.max(1, Math.round(rect.height * pixelRatio));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      const aspect = width / height;
      const nextSimWidth = Math.max(1, Math.round(simRes * Math.max(1, aspect)));
      const nextSimHeight = Math.max(1, Math.round(simRes * Math.max(1, 1 / aspect)));
      const nextDyeWidth = Math.max(1, Math.round(dyeRes * Math.max(1, aspect)));
      const nextDyeHeight = Math.max(1, Math.round(dyeRes * Math.max(1, 1 / aspect)));
      if (
        targets &&
        nextSimWidth === simWidth &&
        nextSimHeight === simHeight &&
        nextDyeWidth === dyeWidth &&
        nextDyeHeight === dyeHeight
      ) {
        return true;
      }

      const nextTargets = createTargets(gl, nextSimWidth, nextSimHeight, nextDyeWidth, nextDyeHeight);
      if (targets) destroyTargets(gl, targets);
      targets = nextTargets;
      simWidth = nextSimWidth;
      simHeight = nextSimHeight;
      dyeWidth = nextDyeWidth;
      dyeHeight = nextDyeHeight;
      return targets !== null;
    };

    const drawFrame = (timestamp: number): void => {
      if (!visible || !targets) {
        frameId = 0;
        return;
      }
      if (!resize() || !targets) {
        frameId = 0;
        return;
      }
      frameId = window.requestAnimationFrame(drawFrame);
      const dt = Math.min(lastFrame === 0 ? 1 / 60 : (timestamp - lastFrame) / 1000, 1 / 30);
      lastFrame = timestamp;
      const aspect = canvas.width / canvas.height;
      const radius = Math.pow(Math.max(0.001, splatRadius * 0.1), 2);
      const frameTargets = targets;

      const applySplat = (
        x: number,
        y: number,
        deltaX: number,
        deltaY: number,
        color: readonly [number, number, number],
        dyeIntensity: number,
      ): void => {
        const velocityProgram = programs.splatVelocity;
        draw(gl, velocityProgram, frameTargets.velocity.write);
        setTexture(gl, velocityProgram, "uTarget", frameTargets.velocity.read.texture, 0);
        set2f(gl, velocityProgram, "uPoint", x, y);
        set2f(gl, velocityProgram, "uDelta", deltaX * aspect, deltaY);
        set1f(gl, velocityProgram, "uRadius", radius);
        set1f(gl, velocityProgram, "uAspect", aspect);
        set1f(gl, velocityProgram, "uForce", splatForce * 0.0002);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        swap(frameTargets.velocity);

        const dyeProgram = programs.splatDye;
        draw(gl, dyeProgram, frameTargets.dye.write);
        setTexture(gl, dyeProgram, "uTarget", frameTargets.dye.read.texture, 0);
        set2f(gl, dyeProgram, "uPoint", x, y);
        set1f(gl, dyeProgram, "uRadius", radius);
        set1f(gl, dyeProgram, "uAspect", aspect);
        set3f(gl, dyeProgram, color);
        set1f(gl, dyeProgram, "uIntensity", dyeIntensity);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        swap(frameTargets.dye);
      };

      if (pendingPointerPoints.length > 0 && latestPointer) {
        const points = pendingPointerPoints;
        pendingPointerPoints = [];
        const lastPoint = points[points.length - 1];
        if (lastPoint.x !== latestPointer.x || lastPoint.y !== latestPointer.y) points.push(latestPointer);

        const cycleLength = Math.max(0.0001, gradientLength);
        const phaseDrift = timestamp * 0.00015;
        const colorAtDistance = (distance: number): [number, number, number] => {
          const phase = (distance / cycleLength + phaseDrift) * Math.PI * 2;
          const blend = 0.5 - 0.5 * Math.cos(phase);
          return mixColorsOklab(palette[0], palette[1], blend);
        };

        const firstPoint = points[0];
        if (!hasPreviousPointer) {
          applySplat(firstPoint.x, firstPoint.y, 0, 0, colorAtDistance(strokeDistance), intensity);
          previousPointerX = firstPoint.x;
          previousPointerY = firstPoint.y;
          hasPreviousPointer = true;
        }

        const step = Math.max(0.0001, Math.sqrt(radius));
        for (const point of points) {
          const deltaX = point.x - previousPointerX;
          const deltaY = point.y - previousPointerY;
          const distance = Math.hypot(deltaX * aspect, deltaY);
          if (distance > 0) {
            const splatCount = Math.min(24, Math.max(1, Math.ceil(distance / step)));
            const distancePerSplat = distance / splatCount;
            for (let index = 1; index <= splatCount; index += 1) {
              const progress = index / splatCount;
              strokeDistance += distancePerSplat;
              applySplat(
                previousPointerX + deltaX * progress,
                previousPointerY + deltaY * progress,
                deltaX / splatCount,
                deltaY / splatCount,
                colorAtDistance(strokeDistance),
                intensity / Math.sqrt(splatCount),
              );
            }
          }
          previousPointerX = point.x;
          previousPointerY = point.y;
        }
      }

      const texelX = 1 / simWidth;
      const texelY = 1 / simHeight;
      let program = programs.curl;
      draw(gl, program, targets.curl);
      setTexture(gl, program, "uVelocity", targets.velocity.read.texture, 0);
      set2f(gl, program, "uTexelSize", texelX, texelY);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      program = programs.vorticity;
      draw(gl, program, targets.velocity.write);
      setTexture(gl, program, "uVelocity", targets.velocity.read.texture, 0);
      setTexture(gl, program, "uCurl", targets.curl.texture, 1);
      set2f(gl, program, "uTexelSize", texelX, texelY);
      set1f(gl, program, "uCurlStrength", curl);
      set1f(gl, program, "uDt", dt);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      swap(targets.velocity);

      program = programs.divergence;
      draw(gl, program, targets.divergence);
      setTexture(gl, program, "uVelocity", targets.velocity.read.texture, 0);
      set2f(gl, program, "uTexelSize", texelX, texelY);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      for (let iteration = 0; iteration < 20; iteration += 1) {
        program = programs.pressure;
        draw(gl, program, targets.pressure.write);
        setTexture(gl, program, "uPressure", targets.pressure.read.texture, 0);
        setTexture(gl, program, "uDivergence", targets.divergence.texture, 1);
        set2f(gl, program, "uTexelSize", texelX, texelY);
        set1f(gl, program, "uPressureDissipation", pressure);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        swap(targets.pressure);
      }

      program = programs.gradient;
      draw(gl, program, targets.velocity.write);
      setTexture(gl, program, "uVelocity", targets.velocity.read.texture, 0);
      setTexture(gl, program, "uPressure", targets.pressure.read.texture, 1);
      set2f(gl, program, "uTexelSize", texelX, texelY);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      swap(targets.velocity);

      program = programs.advectVelocity;
      draw(gl, program, targets.velocity.write);
      setTexture(gl, program, "uVelocity", targets.velocity.read.texture, 0);
      set1f(gl, program, "uDt", dt);
      set1f(gl, program, "uDissipation", velocityDissipation);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      swap(targets.velocity);

      program = programs.advectDye;
      draw(gl, program, targets.dye.write);
      setTexture(gl, program, "uDye", targets.dye.read.texture, 0);
      setTexture(gl, program, "uVelocity", targets.velocity.read.texture, 1);
      set1f(gl, program, "uDt", dt);
      set1f(gl, program, "uDissipation", densityDissipation);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      swap(targets.dye);

      program = programs.render;
      draw(gl, program, null);
      setTexture(gl, program, "uDye", targets.dye.read.texture, 0);
      set1f(gl, program, "uGain", gain);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const handlePointerMove = (event: PointerEvent): void => {
      if (event.pointerType === "touch") return;
      const rect = global
        ? {
            left: 0,
            top: 0,
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight,
          }
        : section.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const events = event.getCoalescedEvents?.() ?? [];
      const samples = events.length > 0 ? events : [event];
      const addPoint = (sample: PointerEvent): void => {
        const point = {
          x: Math.min(1, Math.max(0, (sample.clientX - rect.left) / rect.width)),
          y: 1 - Math.min(1, Math.max(0, (sample.clientY - rect.top) / rect.height)),
        };
        pendingPointerPoints.push(point);
        latestPointer = point;
      };
      for (const sample of samples) {
        addPoint(sample);
      }
      const lastSample = samples[samples.length - 1];
      if (lastSample.clientX !== event.clientX || lastSample.clientY !== event.clientY) {
        addPoint(event);
      }
    };

    const handlePointerEnter = (event: PointerEvent): void => {
      if (event.pointerType === "touch") return;
      latestPointer = null;
      pendingPointerPoints = [];
      hasPreviousPointer = false;
    };

    const handlePointerLeave = (): void => {
      latestPointer = null;
      pendingPointerPoints = [];
      hasPreviousPointer = false;
    };

    const handleResize = (): void => {
      resize();
    };

    section.addEventListener("pointermove", handlePointerMove, { passive: true });
    section.addEventListener("pointerenter", handlePointerEnter);
    section.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("resize", handleResize);
    const resizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(handleResize) : null;
    resizeObserver?.observe(section);

    if (!resize()) {
      section.removeEventListener("pointermove", handlePointerMove);
      section.removeEventListener("pointerenter", handlePointerEnter);
      section.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("resize", handleResize);
      resizeObserver?.disconnect();
      programs.all.forEach((item) => gl.deleteProgram(item));
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      return;
    }

    const intersectionObserver = new IntersectionObserver((entries) => {
      const entry = entries[0];
      visible = Boolean(entry?.isIntersecting);
      if (visible && frameId === 0) {
        lastFrame = 0;
        frameId = window.requestAnimationFrame(drawFrame);
      } else if (!visible && frameId !== 0) {
        window.cancelAnimationFrame(frameId);
        frameId = 0;
        lastFrame = 0;
      }
    });
    intersectionObserver.observe(section);

    return () => {
      if (frameId !== 0) window.cancelAnimationFrame(frameId);
      section.removeEventListener("pointermove", handlePointerMove);
      section.removeEventListener("pointerenter", handlePointerEnter);
      section.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("resize", handleResize);
      resizeObserver?.disconnect();
      intersectionObserver.disconnect();
      if (targets) destroyTargets(gl, targets);
      programs.all.forEach((item) => gl.deleteProgram(item));
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [
    simRes,
    dyeRes,
    densityDissipation,
    velocityDissipation,
    pressure,
    curl,
    splatRadius,
    splatForce,
    intensity,
    gain,
    gradientLength,
    colors,
    global,
  ]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none h-full w-full ${
        global
          ? "fixed inset-0 z-40 opacity-40"
          : "absolute inset-0 z-0"
      }`}
    />
  );
}
