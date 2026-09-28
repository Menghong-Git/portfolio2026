"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap, onIntroDone, prefersReducedMotion } from "@/lib/gsap";

const BG = "#e8effa"; // matches the page background so distant nodes fade into it
const BLUE = "#2563eb";
const VIOLET = "#7c3aed";

// Ashima Arts 3D simplex noise (MIT) — github.com/ashima/webgl-noise
const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

const coreVertex = /* glsl */ `
uniform float uTime;
varying vec3 vNormal;
varying vec3 vView;
varying vec3 vPos;
varying float vNoise;
${NOISE}
void main(){
  float n = snoise(normal * 2.2 + uTime * 0.6);
  vec3 p = position + normal * n * 0.06;
  vNoise = n;
  vPos = position;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vView = normalize(-mv.xyz);
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * mv;
}`;

// Glassy blue orb: pale centre, saturated rim, moving scan bands
const coreFragment = /* glsl */ `
uniform vec3 uColor;
uniform vec3 uColor2;
uniform float uTime;
varying vec3 vNormal;
varying vec3 vView;
varying vec3 vPos;
varying float vNoise;
void main(){
  float fres = pow(1.0 - max(dot(vNormal, vView), 0.0), 1.6);
  float scan = smoothstep(0.88, 1.0, sin((vPos.y - uTime * 0.5) * 36.0) * 0.5 + 0.5);
  float cells = smoothstep(0.5, 0.9, vNoise * 0.5 + 0.5);
  vec3 col = mix(vec3(0.9, 0.94, 1.0), uColor, fres);
  col = mix(col, uColor2, cells * 0.35);
  col = mix(col, uColor, scan * 0.5);
  gl_FragColor = vec4(col, 1.0);
}`;

/**
 * Where the core sits while each section is on screen. It always stays in view — it travels
 * with the reader from side to side. `my` is the vertical position on portrait (phone) screens.
 */
type Stop = { x: number; y: number; my: number; z: number; s: number; tilt: number };
const STOPS: (Stop & { sel: string })[] = [
  { sel: "#about", x: 2.5, y: -0.2, my: 1.7, z: -0.6, s: 0.62, tilt: 0.5 },
  { sel: "#experience", x: 2.7, y: 0, my: 1.9, z: -0.6, s: 0.58, tilt: -0.4 },
  { sel: "#work", x: 2.7, y: 2.05, my: 2.1, z: -0.4, s: 0.32, tilt: 0.3 },
  { sel: "#skills", x: -2.4, y: 0, my: 1.4, z: -0.3, s: 0.72, tilt: 0.5 },
  { sel: "#education", x: 2.6, y: 0, my: 1.9, z: -0.6, s: 0.58, tilt: -0.4 },
  { sel: "#contact", x: 2.3, y: 0, my: -1.3, z: -0.4, s: 0.85, tilt: 0 },
];

function dotTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.45, "rgba(255,255,255,0.9)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

function circlePoints(r: number, segments = 160) {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i < segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    pts.push(new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, 0));
  }
  return pts;
}

export default function Scene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduced = prefersReducedMotion();
    const small = window.innerWidth < 768;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      return; // no WebGL — the page still works without the scene
    }
    let pixelRatio = Math.min(window.devicePixelRatio, small ? 1.5 : 1.75);
    const size = () => [mount.clientWidth, mount.clientHeight] as const;
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(...size(), false);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(BG, 8, 22);
    const camera = new THREE.PerspectiveCamera(42, size()[0] / size()[1], 0.1, 100);
    camera.position.set(0, 0, 8);

    const disposables: { dispose: () => void }[] = [];
    const track = <T extends { dispose: () => void }>(o: T) => (disposables.push(o), o);
    const blue = new THREE.Color(BLUE);
    const violet = new THREE.Color(VIOLET);
    const dot = track(dotTexture());

    const lineMat = (color: THREE.Color, opacity: number) =>
      track(new THREE.LineBasicMaterial({ color, transparent: true, opacity, depthWrite: false }));
    const pointMat = (color: string, sizePx: number, opacity = 1) =>
      track(new THREE.PointsMaterial({ color, size: sizePx, map: dot, transparent: true, opacity, depthWrite: false, alphaTest: 0.01 }));

    // ---------- The core ----------
    const core = new THREE.Group();
    const coreUniforms = { uTime: { value: 0 }, uColor: { value: blue }, uColor2: { value: violet } };
    core.add(
      new THREE.Mesh(
        track(new THREE.IcosahedronGeometry(0.85, 40)),
        track(new THREE.ShaderMaterial({ vertexShader: coreVertex, fragmentShader: coreFragment, uniforms: coreUniforms })),
      ),
    );

    const shellA = new THREE.LineSegments(track(new THREE.EdgesGeometry(track(new THREE.IcosahedronGeometry(1.3, 1)))), lineMat(blue, 0.55));
    const shellBGeo = track(new THREE.IcosahedronGeometry(1.85, 0));
    const shellB = new THREE.LineSegments(track(new THREE.EdgesGeometry(shellBGeo)), lineMat(violet, 0.5));
    shellB.add(new THREE.Points(shellBGeo, pointMat(BLUE, 0.14)));
    core.add(shellA, shellB);

    // HUD tick ring, kept facing the viewer
    const ticks: number[] = [];
    for (let i = 0; i < 120; i++) {
      const a = (i / 120) * Math.PI * 2;
      const inner = i % 10 === 0 ? 2.25 : 2.38;
      ticks.push(Math.cos(a) * inner, Math.sin(a) * inner, 0, Math.cos(a) * 2.48, Math.sin(a) * 2.48, 0);
    }
    const tickGeo = track(new THREE.BufferGeometry());
    tickGeo.setAttribute("position", new THREE.Float32BufferAttribute(ticks, 3));
    const hudSpin = new THREE.Group();
    hudSpin.add(
      new THREE.LineSegments(tickGeo, lineMat(blue, 0.4)),
      new THREE.Line(track(new THREE.BufferGeometry().setFromPoints(circlePoints(2.7, 200).slice(0, 70))), lineMat(blue, 0.85)),
    );
    const hud = new THREE.Group();
    hud.add(hudSpin);
    core.add(hud);

    // Orbit rings with data packets travelling along them
    const orbits: { packets: THREE.Mesh[]; r: number; speed: number }[] = [];
    const packetGeo = track(new THREE.SphereGeometry(0.055, 12, 12));
    const packetMat = track(new THREE.MeshBasicMaterial({ color: BLUE }));
    [
      { r: 2.05, rot: [1.2, 0.2, 0], speed: 0.9, color: blue },
      { r: 2.35, rot: [0.4, 1.1, 0.3], speed: -0.6, color: violet },
      { r: 1.6, rot: [-0.6, 0.5, 1], speed: 1.3, color: blue },
    ].forEach((o) => {
      const group = new THREE.Group();
      group.rotation.set(o.rot[0], o.rot[1], o.rot[2]);
      group.add(new THREE.LineLoop(track(new THREE.BufferGeometry().setFromPoints(circlePoints(o.r))), lineMat(o.color, 0.3)));
      const packets = [0, 1].map(() => {
        const m = new THREE.Mesh(packetGeo, packetMat);
        group.add(m);
        return m;
      });
      core.add(group);
      orbits.push({ packets, r: o.r, speed: o.speed });
    });
    core.scale.setScalar(0.001);
    scene.add(core);

    // ---------- Faint network in the background ----------
    const NODES = small ? 70 : 130;
    const nodes: THREE.Vector3[] = [];
    for (let i = 0; i < NODES; i++) {
      const r = 4 + Math.random() * 5;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      nodes.push(new THREE.Vector3(r * Math.sin(ph) * Math.cos(th), r * Math.sin(ph) * Math.sin(th) * 0.7, r * Math.cos(ph) - 3));
    }
    const links: number[] = [];
    for (let i = 0; i < NODES; i++)
      for (let j = i + 1; j < NODES; j++)
        if (nodes[i].distanceTo(nodes[j]) < 2.1 && links.length < 700 * 6)
          links.push(nodes[i].x, nodes[i].y, nodes[i].z, nodes[j].x, nodes[j].y, nodes[j].z);
    const plexus = new THREE.Group();
    const linkGeo = track(new THREE.BufferGeometry());
    linkGeo.setAttribute("position", new THREE.Float32BufferAttribute(links, 3));
    const linkMat = lineMat(blue, 0);
    const nodeMat = pointMat(BLUE, 0.08, 0);
    plexus.add(new THREE.LineSegments(linkGeo, linkMat), new THREE.Points(track(new THREE.BufferGeometry().setFromPoints(nodes)), nodeMat));
    scene.add(plexus);

    // ---------- Scroll-driven target ----------
    const target: Stop = { x: 1.9, y: 0.1, my: 1.9, z: 0, s: 1, tilt: 0 };
    const hero: Stop = { ...target };
    const ctx = gsap.context(() => {
      STOPS.forEach(({ sel, ...to }, i) => {
        const from: Stop = i === 0 ? hero : STOPS[i - 1];
        gsap.fromTo(
          target,
          { x: from.x, y: from.y, my: from.my, z: from.z, s: from.s, tilt: from.tilt },
          {
            ...to,
            ease: "none",
            immediateRender: false,
            scrollTrigger: { trigger: sel, start: "top bottom", end: "top 25%", scrub: true, refreshPriority: -1 },
          },
        );
      });
    });

    // ---------- Power-on sequence ----------
    const power = { v: 0, spin: 0 };
    const offIntro = onIntroDone(() => {
      gsap
        .timeline()
        .to(power, { v: 1, duration: 2, ease: "expo.out" })
        .fromTo(power, { spin: 6 }, { spin: 0, duration: 2.4, ease: "power3.out" }, 0)
        .to(linkMat, { opacity: 0.12, duration: 2 }, 0.4)
        .to(nodeMat, { opacity: 0.55, duration: 2 }, 0.4);
    });

    // ---------- Input ----------
    const pointer = { x: 0, y: 0 };
    const onPointer = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    const onResize = () => {
      const [w, h] = size();
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    window.addEventListener("resize", onResize);

    // ---------- Loop ----------
    const speed = reduced ? 0.2 : 1;
    let last = 0;
    let t = 0;
    let lastScroll = window.scrollY;
    let scrollVel = 0; // px per second, smoothed
    let slowFrames = 0;
    let sampled = 0;

    const tick = (time: number) => {
      const raw = last ? (time - last) / 1000 : 0.016;
      const dt = Math.min(0.05, raw);
      last = time;
      t += dt * speed;
      coreUniforms.uTime.value = t;

      // Adaptive quality: drop resolution if frames keep running slow
      if (power.v > 0.99 && ++sampled && raw > 1 / 40) slowFrames++;
      if (sampled >= 90) {
        if (slowFrames > 45 && pixelRatio > 0.75) {
          pixelRatio = Math.max(0.75, pixelRatio * 0.75);
          renderer.setPixelRatio(pixelRatio);
          renderer.setSize(...size(), false);
        }
        sampled = slowFrames = 0;
      }

      // Scroll velocity: the core trails behind fast scrolling, then catches up
      const sy = window.scrollY;
      const v = dt > 0 ? (sy - lastScroll) / dt : 0;
      lastScroll = sy;
      scrollVel += (v - scrollVel) * Math.min(1, dt * 6);
      const lag = reduced ? 0 : gsap.utils.clamp(-0.9, 0.9, scrollVel * 0.0006);

      const portrait = camera.aspect < 1;
      const spread = Math.min(1, camera.aspect / 1.6);
      const k = 1 - Math.pow(0.02, dt); // frame-rate independent easing
      core.position.x += (target.x * spread - core.position.x) * k;
      core.position.y += ((portrait ? target.my : target.y) + lag - core.position.y) * k;
      core.position.z += (target.z - core.position.z) * k;
      const s = Math.max(0.001, target.s * power.v * (portrait ? 0.55 : 1));
      core.scale.setScalar(core.scale.x + (s - core.scale.x) * Math.max(k, power.v < 1 ? 0.2 : 0));

      // Spin faster while scrolling
      const spin = (1 + power.spin + Math.min(4, Math.abs(scrollVel) * 0.003)) * speed;
      shellA.rotation.x += dt * 0.25 * spin;
      shellA.rotation.y += dt * 0.35 * spin;
      shellB.rotation.y -= dt * 0.18 * spin;
      shellB.rotation.z += dt * 0.1 * spin;
      hudSpin.rotation.z -= dt * 0.12 * spin;
      orbits.forEach((o, i) =>
        o.packets.forEach((p, j) => {
          const a = t * o.speed * (1 + Math.min(2, Math.abs(scrollVel) * 0.002)) + j * Math.PI + i;
          p.position.set(Math.cos(a) * o.r, Math.sin(a) * o.r, 0);
        }),
      );

      core.rotation.x += (pointer.y * 0.3 + lag * 0.4 - core.rotation.x) * k;
      core.rotation.y += (pointer.x * 0.4 + target.tilt - core.rotation.y) * k;
      hud.quaternion.copy(core.quaternion).invert();

      plexus.rotation.y = t * 0.03 + pointer.x * 0.1;
      plexus.rotation.x = pointer.y * 0.06;
      plexus.position.y = sy * 0.0006;

      camera.position.x += (pointer.x * 0.35 - camera.position.x) * k * 0.5;
      camera.position.y += (pointer.y * 0.2 - camera.position.y) * k * 0.5;
      camera.lookAt(0, 0, -2);

      renderer.render(scene, camera);
    };
    renderer.setAnimationLoop(tick);

    let running = true;
    const onVisibility = () => {
      const visible = document.visibilityState === "visible";
      if (visible && !running) {
        last = 0;
        lastScroll = window.scrollY;
        renderer.setAnimationLoop(tick);
      }
      if (!visible && running) renderer.setAnimationLoop(null);
      running = visible;
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      offIntro();
      ctx.revert();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      renderer.setAnimationLoop(null);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={mountRef} className="scene" aria-hidden="true" />;
}
