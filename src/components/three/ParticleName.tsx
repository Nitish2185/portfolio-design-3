"use client";

import { useEffect, useRef, type RefObject } from "react";
import * as THREE from "three";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { onIntroDone } from "@/lib/intro";

const vertex = /* glsl */ `
uniform float uTime;
uniform float uIntro;
uniform float uMorph;
uniform float uBurst;
uniform vec2 uMouse;
uniform float uSize;
uniform float uPixelRatio;

attribute vec3 aScatter;
attribute vec3 aSphere;
attribute float aSeed;

varying float vAccent;

void main() {
  vec3 p = position;

  // Push particles away from the cursor (only while they spell the name)
  vec2 d = p.xy - uMouse;
  float dist = length(d);
  float push = smoothstep(1.1, 0.0, dist) * (1.0 - uMorph);
  p.xy += normalize(d + 0.0001) * push * 0.55;
  p.z += push * 1.2;

  // Constant shimmer
  p += vec3(sin(uTime * 1.3 + aSeed * 40.0), cos(uTime * 1.1 + aSeed * 30.0), sin(uTime * 0.8 + aSeed * 20.0)) * 0.012;

  // Click burst
  p += aScatter * uBurst * 0.3;

  // Fly in from scattered positions
  p = mix(aScatter, p, uIntro);

  // Fold into a slowly turning sphere as the page scrolls
  float a = uTime * 0.25 + uMorph * 2.0;
  vec3 s = aSphere;
  s.xz = mat2(cos(a), -sin(a), sin(a), cos(a)) * s.xz;
  s.yz = mat2(cos(0.4), -sin(0.4), sin(0.4), cos(0.4)) * s.yz;
  p = mix(p, s, smoothstep(0.0, 1.0, uMorph));

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * uPixelRatio * (0.75 + fract(aSeed * 7.31) * 0.5) / -mv.z;
  vAccent = step(0.975, aSeed);
}
`;

const fragment = /* glsl */ `
uniform vec3 uColor;
uniform vec3 uAccent;
varying float vAccent;

void main() {
  // Square "pixels" (no rounding) for a Swiss/digital look
  gl_FragColor = vec4(mix(uColor, uAccent, vAccent), 1.0);
}
`;

/** Samples the text from a 2D canvas and returns point positions in world units. */
function sampleText(lines: string[], fontFamily: string, maxWidth: number, maxHeight: number) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return new Float32Array();
  const fontSize = 220;
  const lineHeight = fontSize * 0.92;
  ctx.font = `900 ${fontSize}px ${fontFamily}`;
  if ("fontStretch" in ctx) ctx.fontStretch = "extra-expanded";
  const widths = lines.map((l) => ctx.measureText(l).width);
  canvas.width = Math.ceil(Math.max(...widths)) + 20;
  canvas.height = Math.ceil(lineHeight * lines.length) + 20;

  // Resizing the canvas resets its state
  ctx.font = `900 ${fontSize}px ${fontFamily}`;
  if ("fontStretch" in ctx) ctx.fontStretch = "extra-expanded";
  ctx.fillStyle = "#fff";
  ctx.textBaseline = "top";
  lines.forEach((line, i) => ctx.fillText(line, (canvas.width - widths[i]) / 2, 10 + i * lineHeight));

  const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const step = Math.max(3, Math.round(Math.sqrt((width * height) / 60000)));
  const scale = Math.min(maxWidth / width, maxHeight / height);
  const points: number[] = [];
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      if (data[(y * width + x) * 4 + 3] > 128) {
        points.push((x - width / 2) * scale, -(y - height / 2) * scale, 0);
      }
    }
  }
  return new Float32Array(points);
}

type Props = {
  lines: string[];
  /** 0 = name, 1 = sphere. Written by the hero's ScrollTrigger. */
  morph: RefObject<number>;
  className?: string;
};

/**
 * The name, rebuilt from thousands of square particles (Three.js points).
 * They assemble after the intro, flee the cursor, scatter on click and
 * fold into a rotating sphere as you scroll.
 */
export function ParticleName({ lines, morph, className = "" }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let disposed = false;
    let cleanup = () => {};

    const start = async () => {
      const family = getComputedStyle(document.documentElement).getPropertyValue("--font-anybody").trim() || "sans-serif";
      try {
        await document.fonts.load(`900 100px ${family}`);
      } catch {}
      if (disposed) return;

      let renderer: THREE.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
      } catch {
        host.classList.add("no-webgl");
        return;
      }

      const reduce = prefersReducedMotion();
      const pixelRatio = Math.min(window.devicePixelRatio, 2);
      renderer.setPixelRatio(pixelRatio);
      const canvas = renderer.domElement;
      canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;";
      host.appendChild(canvas);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
      camera.position.z = 10;

      const uniforms = {
        uTime: { value: 0 },
        uIntro: { value: reduce ? 1 : 0 },
        uMorph: { value: 0 },
        uBurst: { value: 0 },
        uMouse: { value: new THREE.Vector2(99, 99) },
        uSize: { value: 30 },
        uPixelRatio: { value: pixelRatio },
        uColor: { value: new THREE.Color("#f4f5f7") },
        uAccent: { value: new THREE.Color("#ffd23f") },
      };
      const material = new THREE.ShaderMaterial({ uniforms, vertexShader: vertex, fragmentShader: fragment, transparent: true, depthWrite: false });
      let geometry = new THREE.BufferGeometry();
      const points = new THREE.Points(geometry, material);
      scene.add(points);

      const view = { width: 1, height: 1 };

      const build = () => {
        const positions = sampleText(lines, family, view.width * 0.88, view.height * 0.56);
        const count = positions.length / 3;
        const scatter = new Float32Array(count * 3);
        const sphere = new Float32Array(count * 3);
        const seeds = new Float32Array(count);
        const radius = Math.min(view.width, view.height) * 0.32;
        for (let i = 0; i < count; i++) {
          scatter[i * 3] = (Math.random() - 0.5) * view.width * 1.6;
          scatter[i * 3 + 1] = (Math.random() - 0.5) * view.height * 1.6;
          scatter[i * 3 + 2] = (Math.random() - 0.5) * 8;
          // Fibonacci sphere: evenly spread points
          const y = 1 - (i / Math.max(count - 1, 1)) * 2;
          const r = Math.sqrt(1 - y * y);
          const theta = i * 2.399963;
          sphere[i * 3] = Math.cos(theta) * r * radius;
          sphere[i * 3 + 1] = y * radius;
          sphere[i * 3 + 2] = Math.sin(theta) * r * radius;
          seeds[i] = Math.random();
        }
        geometry.dispose();
        geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute("aScatter", new THREE.BufferAttribute(scatter, 3));
        geometry.setAttribute("aSphere", new THREE.BufferAttribute(sphere, 3));
        geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
        points.geometry = geometry;
      };

      const resize = () => {
        const w = host.clientWidth;
        const h = host.clientHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        view.height = 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
        view.width = view.height * camera.aspect;
        uniforms.uSize.value = Math.max(18, Math.min(34, w / 45));
        build();
      };
      resize();
      let resizeTimer = 0;
      const ro = new ResizeObserver(() => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(resize, 150);
      });
      ro.observe(host);

      const unsubscribe = onIntroDone(() => {
        if (!reduce) gsap.to(uniforms.uIntro, { value: 1, duration: 2.4, ease: "expo.inOut", delay: 0.1 });
      });

      const mouse = new THREE.Vector2(99, 99);
      const onMove = (e: PointerEvent) => {
        const r = host.getBoundingClientRect();
        mouse.set(((e.clientX - r.left) / r.width - 0.5) * view.width, -((e.clientY - r.top) / r.height - 0.5) * view.height);
      };
      const onLeave = () => mouse.set(99, 99);
      const onDown = () => {
        if (reduce) return;
        gsap.timeline()
          .to(uniforms.uBurst, { value: 1, duration: 0.35, ease: "power3.out" })
          .to(uniforms.uBurst, { value: 0, duration: 1.6, ease: "elastic.out(1, 0.35)" });
      };
      host.addEventListener("pointermove", onMove);
      host.addEventListener("pointerleave", onLeave);
      host.addEventListener("pointerdown", onDown);

      let visible = true;
      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
      });
      io.observe(host);

      let last = performance.now();
      let frame = 0;
      const smoothMouse = new THREE.Vector2(99, 99);
      const render = (now = performance.now()) => {
        frame = requestAnimationFrame(render);
        const delta = Math.min((now - last) / 1000, 0.05);
        last = now;
        if (!visible || document.hidden) return;
        if (!reduce) uniforms.uTime.value += delta;
        smoothMouse.lerp(mouse, mouse.x > 50 ? 1 : 0.15);
        uniforms.uMouse.value.copy(smoothMouse);
        uniforms.uMorph.value = morph.current ?? 0;
        points.rotation.y = smoothMouse.x < 50 ? smoothMouse.x * 0.02 : 0;
        renderer.render(scene, camera);
      };
      render();

      cleanup = () => {
        cancelAnimationFrame(frame);
        window.clearTimeout(resizeTimer);
        unsubscribe();
        ro.disconnect();
        io.disconnect();
        host.removeEventListener("pointermove", onMove);
        host.removeEventListener("pointerleave", onLeave);
        host.removeEventListener("pointerdown", onDown);
        gsap.killTweensOf([uniforms.uIntro, uniforms.uBurst]);
        geometry.dispose();
        material.dispose();
        renderer.dispose();
        canvas.remove();
      };
    };

    start();
    return () => {
      disposed = true;
      cleanup();
    };
  }, [lines, morph]);

  return <div ref={hostRef} className={`group/webgl ${className}`} />;
}
