import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import {
  backdropFragment,
  backdropVertex,
  haloFragment,
  platformFragment,
  pointsFragment,
  pointsVertex,
  shellFragment,
  shellVertex,
  uvVertex,
} from './shaders';

// Monochrome studio: the "violet" and "cyan" slots now carry warm bone and cool silver.
const PALETTE = {
  base: '#0d0d0d',
  deep: '#050505',
  violet: '#cfc8b8',
  cyan: '#e9ecef',
  white: '#ffffff',
};

/** Outer radius of the sculpture (largest orbit ring), used to fit it to the viewport. */
const SCULPTURE_RADIUS = 2.65;

/**
 * Where the sculpture sits for each section. fx/fy are fractions of the visible
 * half-width/height at the focal plane, s is how much of the shorter half-extent it fills,
 * dim scales its luminance so copy stays readable.
 */
const SCENE_STATES = {
  wide: {
    home: { fx: 0.52, fy: 0.02, s: 0.7, dim: 1, tilt: 0 },
    about: { fx: -0.64, fy: 0.04, s: 0.46, dim: 0.26, tilt: 0.35 },
    skills: { fx: 0.68, fy: -0.04, s: 0.42, dim: 0.24, tilt: -0.2 },
    experience: { fx: -0.68, fy: 0.02, s: 0.4, dim: 0.22, tilt: 0.25 },
    workflow: { fx: 0.68, fy: 0, s: 0.4, dim: 0.22, tilt: -0.3 },
    projects: { fx: 0, fy: 0, s: 0.62, dim: 0.1, tilt: 0.5 },
    cv: { fx: -0.66, fy: 0, s: 0.38, dim: 0.22, tilt: 0.2 },
    education: { fx: 0.66, fy: 0, s: 0.38, dim: 0.22, tilt: -0.2 },
    contact: { fx: 0.52, fy: 0.02, s: 0.74, dim: 0.95, tilt: 0 },
    detail: { fx: 0.72, fy: 0.45, s: 0.42, dim: 0.3, tilt: 0.3 },
  },
  tall: {
    home: { fx: 0.42, fy: 0.22, s: 0.62, dim: 0.5, tilt: 0 },
    about: { fx: 0.35, fy: 0.1, s: 0.9, dim: 0.22, tilt: 0.35 },
    skills: { fx: -0.35, fy: 0, s: 0.85, dim: 0.2, tilt: -0.2 },
    experience: { fx: 0.35, fy: 0, s: 0.85, dim: 0.2, tilt: 0.2 },
    workflow: { fx: -0.35, fy: 0, s: 0.85, dim: 0.2, tilt: -0.3 },
    projects: { fx: 0, fy: 0, s: 1, dim: 0.12, tilt: 0.5 },
    cv: { fx: 0.3, fy: 0, s: 0.85, dim: 0.2, tilt: 0.2 },
    education: { fx: -0.3, fy: 0, s: 0.85, dim: 0.2, tilt: -0.2 },
    contact: { fx: 0, fy: 0.55, s: 0.9, dim: 0.75, tilt: 0 },
    detail: { fx: 0.55, fy: 0.62, s: 0.6, dim: 0.3, tilt: 0.3 },
  },
};

const QUALITY = {
  high: { maxDpr: 1.25, stars: 700, shellDetail: 3, physical: true, fps: 60 },
  mid: { maxDpr: 1, stars: 450, shellDetail: 3, physical: false, fps: 30 },
  low: { maxDpr: 1, stars: 280, shellDetail: 2, physical: false, fps: 30 },
};

export function detectQualityTier() {
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const cores = navigator.hardwareConcurrency || 4;
  const memory = navigator.deviceMemory || 4;
  const small = Math.min(window.screen.width, window.screen.height) < 600;
  if (coarse && (small || cores <= 4 || memory <= 3)) return 'low';
  if (coarse || cores <= 4 || memory <= 4) return 'mid';
  return 'high';
}

const damp = (current, target, lambda, dt) => THREE.MathUtils.lerp(current, target, 1 - Math.exp(-lambda * dt));
const smooth = (t) => t * t * (3 - 2 * t);

export class World {
  constructor({ canvas, tier = 'high', reducedMotion = false, onReady, onContextLost }) {
    this.canvas = canvas;
    this.tier = tier;
    this.quality = QUALITY[tier] || QUALITY.high;
    this.reducedMotion = reducedMotion;
    this.onReady = onReady;
    this.onContextLost = onContextLost;

    this.clock = new THREE.Clock();
    this.time = 0;
    this.frameInterval = 1 / this.quality.fps - 0.002;
    this.pendingTime = 0;
    this.scrollVelocity = 0;
    this.lastScrollY = window.scrollY;
    this.anchors = [];
    this.current = { fx: 0.5, fy: 0, s: 0.78, dim: 0, tilt: 0 };
    this.frameSamples = [];
    this.disposables = [];
    this.running = false;
    this.readyFired = false;

    this.initRenderer();
    this.initScene();
    this.bind();
    this.resize();
    this.measureSections();
    this.snapToTarget();
  }

  // ---------------------------------------------------------------- setup

  initRenderer() {
    const renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: this.tier === 'high',
      alpha: false,
      powerPreference: 'high-performance',
      stencil: false,
    });
    renderer.setClearColor(PALETTE.deep, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    this.dpr = Math.min(window.devicePixelRatio || 1, this.quality.maxDpr);
    renderer.setPixelRatio(this.dpr);
    this.renderer = renderer;
  }

  track(...items) {
    this.disposables.push(...items);
    return items[0];
  }

  color(hex) {
    return new THREE.Color(hex);
  }

  initScene() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 80);
    camera.position.set(0, 0, 8);
    this.scene = scene;
    this.camera = camera;

    const pmrem = new THREE.PMREMGenerator(this.renderer);
    const room = new RoomEnvironment();
    this.envMap = this.track(pmrem.fromScene(room, 0.04).texture);
    room.traverse((child) => {
      child.geometry?.dispose();
      child.material?.dispose?.();
    });
    pmrem.dispose();
    scene.environment = this.envMap;

    this.buildBackdrop();
    this.buildStars();
    this.buildSculpture();
  }

  buildBackdrop() {
    this.backdropUniforms = {
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uAspect: { value: 1 },
      uBase: { value: this.color(PALETTE.base) },
      uDeep: { value: this.color(PALETTE.deep) },
      uViolet: { value: this.color(PALETTE.violet) },
      uCyan: { value: this.color(PALETTE.cyan) },
    };
    const geometry = this.track(new THREE.PlaneGeometry(2, 2));
    const material = this.track(
      new THREE.ShaderMaterial({
        vertexShader: backdropVertex,
        fragmentShader: backdropFragment,
        uniforms: this.backdropUniforms,
        depthWrite: false,
        depthTest: false,
      }),
    );
    const mesh = new THREE.Mesh(geometry, material);
    mesh.frustumCulled = false;
    mesh.renderOrder = -10;
    this.scene.add(mesh);
  }

  buildStars() {
    const count = this.quality.stars;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);
    const tints = [this.color(PALETTE.violet), this.color(PALETTE.cyan), this.color(PALETTE.white)];

    for (let i = 0; i < count; i += 1) {
      // Spread on a thick shell, keeping the space right in front of the camera clear.
      let x;
      let y;
      let z;
      do {
        const r = THREE.MathUtils.randFloat(5, 24);
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(THREE.MathUtils.randFloatSpread(2));
        x = r * Math.sin(phi) * Math.cos(theta);
        y = r * Math.sin(phi) * Math.sin(theta) * 1.6;
        z = r * Math.cos(phi) - 4;
      } while (z > 3.5);
      positions.set([x, y, z], i * 3);
      const tint = tints[Math.random() < 0.55 ? 2 : Math.floor(Math.random() * 2)];
      colors.set([tint.r, tint.g, tint.b], i * 3);
      sizes[i] = Math.random() < 0.06 ? THREE.MathUtils.randFloat(1.6, 2.6) : THREE.MathUtils.randFloat(0.35, 1.1);
      phases[i] = Math.random();
    }

    const geometry = this.track(new THREE.BufferGeometry());
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));

    this.starUniforms = {
      uTime: { value: 0 },
      uPixelRatio: { value: this.dpr },
      uScale: { value: 3.2 },
      uOpacity: { value: 0.85 },
    };
    const material = this.track(
      new THREE.ShaderMaterial({
        vertexShader: pointsVertex,
        fragmentShader: pointsFragment,
        uniforms: this.starUniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    this.stars = new THREE.Points(geometry, material);
    this.starField = new THREE.Group();
    this.starField.add(this.stars);
    this.scene.add(this.starField);
  }

  buildSculpture() {
    const violet = this.color(PALETTE.violet);
    const cyan = this.color(PALETTE.cyan);

    // anchor: section-driven placement · tilt: per-section pose · spin: slow idle rotation
    this.anchor = new THREE.Group();
    this.tilt = new THREE.Group();
    this.spin = new THREE.Group();
    this.anchor.add(this.tilt);
    this.tilt.add(this.spin);
    this.scene.add(this.anchor);

    // Faceted chrome crystal core
    const crystalGeometry = this.track(new THREE.IcosahedronGeometry(0.92, 0));
    const crystalMaterial = this.track(
      this.quality.physical
        ? new THREE.MeshPhysicalMaterial({
            color: '#c4c4c0',
            metalness: 0.95,
            roughness: 0.16,
            iridescence: 0.18,
            iridescenceIOR: 1.55,
            iridescenceThicknessRange: [180, 820],
            clearcoat: 1,
            clearcoatRoughness: 0.08,
            envMapIntensity: 1.35,
            flatShading: true,
          })
        : new THREE.MeshStandardMaterial({
            color: '#b4b4b0',
            metalness: 0.92,
            roughness: 0.2,
            envMapIntensity: 1.3,
            flatShading: true,
          }),
    );
    this.crystal = new THREE.Mesh(crystalGeometry, crystalMaterial);
    this.spin.add(this.crystal);

    const edgeGeometry = this.track(new THREE.EdgesGeometry(crystalGeometry));
    this.edgeMaterial = this.track(
      new THREE.LineBasicMaterial({ color: cyan, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    this.crystal.add(new THREE.LineSegments(edgeGeometry, this.edgeMaterial));

    // Holographic lattice shell + nodes
    this.shellUniforms = {
      uTime: { value: 0 },
      uAmp: { value: 0.16 },
      uSize: { value: 0 },
      uOpacity: { value: 1 },
      uViolet: { value: violet },
      uCyan: { value: cyan },
    };
    const shellGeometry = this.track(new THREE.IcosahedronGeometry(1.5, this.quality.shellDetail));
    const shellMaterial = this.track(
      new THREE.ShaderMaterial({
        vertexShader: shellVertex,
        fragmentShader: shellFragment,
        uniforms: this.shellUniforms,
        wireframe: true,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    this.shell = new THREE.Mesh(shellGeometry, shellMaterial);
    this.spin.add(this.shell);

    const nodeSource = new THREE.IcosahedronGeometry(1.5, 2);
    nodeSource.deleteAttribute('normal');
    nodeSource.deleteAttribute('uv');
    const nodeGeometry = this.track(mergeVertices(nodeSource));
    nodeSource.dispose();
    this.nodeUniforms = { ...this.shellUniforms, uSize: { value: 9 * this.dpr }, uOpacity: { value: 1 } };
    const nodeMaterial = this.track(
      new THREE.ShaderMaterial({
        vertexShader: shellVertex,
        fragmentShader: shellFragment,
        uniforms: this.nodeUniforms,
        defines: { POINTS: '' },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    this.spin.add(new THREE.Points(nodeGeometry, nodeMaterial));

    // Orbit rings with travelling data packets (requests → events → responses)
    this.rings = [];
    const ringSpecs = [
      { radius: 2.05, rot: [1.18, 0.22, 0], speed: 0.42, color: cyan, dashed: false, packets: 3 },
      { radius: 2.35, rot: [0.42, 0.95, 0.32], speed: -0.3, color: violet, dashed: true, packets: 2 },
      { radius: SCULPTURE_RADIUS, rot: [-0.92, -0.38, 0.62], speed: 0.22, color: cyan, dashed: false, packets: 2 },
    ];
    ringSpecs.forEach((spec, index) => {
      const pivot = new THREE.Group();
      pivot.rotation.set(...spec.rot);
      const orbit = new THREE.Group();
      pivot.add(orbit);

      const curve = new THREE.EllipseCurve(0, 0, spec.radius, spec.radius, 0, Math.PI * 2);
      const points = curve.getPoints(160).map((p) => new THREE.Vector3(p.x, p.y, 0));
      const lineGeometry = this.track(new THREE.BufferGeometry().setFromPoints(points));
      const lineMaterial = this.track(
        spec.dashed
          ? new THREE.LineDashedMaterial({ color: spec.color, dashSize: 0.12, gapSize: 0.09, transparent: true, opacity: 0.7, depthWrite: false })
          : new THREE.LineBasicMaterial({ color: spec.color, transparent: true, opacity: 0.6, depthWrite: false }),
      );
      const line = new THREE.Line(lineGeometry, lineMaterial);
      if (spec.dashed) line.computeLineDistances();
      orbit.add(line);

      const packetPositions = new Float32Array(spec.packets * 3);
      const packetGeometry = this.track(new THREE.BufferGeometry());
      packetGeometry.setAttribute('position', new THREE.BufferAttribute(packetPositions, 3));
      packetGeometry.setAttribute('aColor', new THREE.BufferAttribute(new Float32Array(spec.packets * 3).fill(1), 3));
      packetGeometry.setAttribute('aSize', new THREE.BufferAttribute(new Float32Array(spec.packets).fill(2.4), 1));
      packetGeometry.setAttribute('aPhase', new THREE.BufferAttribute(new Float32Array(spec.packets).fill(0.25 * index), 1));
      const packetMaterial = this.track(
        new THREE.ShaderMaterial({
          vertexShader: pointsVertex,
          fragmentShader: pointsFragment,
          uniforms: {
            uTime: { value: 0 },
            uPixelRatio: { value: this.dpr },
            uScale: { value: 3.4 },
            uOpacity: { value: 1 },
          },
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        }),
      );
      const packets = new THREE.Points(packetGeometry, packetMaterial);
      packets.frustumCulled = false;
      orbit.add(packets);

      this.tilt.add(pivot);
      this.rings.push({ spec, orbit, lineMaterial, packets, packetMaterial, baseOpacity: lineMaterial.opacity });
    });

    // Camera-facing halo
    this.haloUniforms = { uViolet: { value: violet }, uCyan: { value: cyan }, uOpacity: { value: 1 }, uTime: { value: 0 } };
    this.halo = new THREE.Mesh(
      this.track(new THREE.PlaneGeometry(7.5, 7.5)),
      this.track(
        new THREE.ShaderMaterial({
          vertexShader: uvVertex,
          fragmentShader: haloFragment,
          uniforms: this.haloUniforms,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        }),
      ),
    );
    this.halo.renderOrder = -1;
    this.anchor.add(this.halo);

    // Holographic platform (reads as a soft light pool / contact shadow beneath the core)
    this.platformUniforms = { uViolet: { value: violet }, uCyan: { value: cyan }, uOpacity: { value: 1 }, uTime: { value: 0 } };
    this.platform = new THREE.Mesh(
      this.track(new THREE.PlaneGeometry(5.6, 5.6)),
      this.track(
        new THREE.ShaderMaterial({
          vertexShader: uvVertex,
          fragmentShader: platformFragment,
          uniforms: this.platformUniforms,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          side: THREE.DoubleSide,
        }),
      ),
    );
    this.platform.rotation.x = -Math.PI / 2;
    this.platform.position.y = -2.25;
    this.anchor.add(this.platform);

    // Coloured rim lights orbiting the crystal
    this.violetLight = new THREE.PointLight(violet, 22, 9, 2);
    this.cyanLight = new THREE.PointLight(cyan, 16, 9, 2);
    this.anchor.add(this.violetLight, this.cyanLight);
    const key = new THREE.DirectionalLight('#ffffff', 0.6);
    key.position.set(3, 4, 5);
    this.scene.add(key);
  }

  // ---------------------------------------------------------------- events

  bind() {
    this.handlers = {
      scroll: () => {
        if (this.reducedMotion) this.requestStaticRender();
      },
      visibility: () => (document.hidden ? this.stop() : this.start()),
      contextlost: (event) => {
        event.preventDefault();
        this.stop();
        this.onContextLost?.();
      },
    };

    window.addEventListener('scroll', this.handlers.scroll, { passive: true });
    document.addEventListener('visibilitychange', this.handlers.visibility);
    this.canvas.addEventListener('webglcontextlost', this.handlers.contextlost);

    this.resizeObserver = new ResizeObserver(() => {
      this.resize();
      this.measureSections();
      if (this.reducedMotion) this.requestStaticRender();
    });
    this.resizeObserver.observe(this.canvas);
    this.resizeObserver.observe(document.body);
  }

  resize() {
    const width = this.canvas.clientWidth || window.innerWidth;
    const height = this.canvas.clientHeight || window.innerHeight;
    if (width === this.width && height === this.height) return;
    this.width = width;
    this.height = height;
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.backdropUniforms.uAspect.value = this.camera.aspect;
    this.layout = this.camera.aspect < 0.9 ? 'tall' : 'wide';
  }

  measureSections() {
    const nodes = Array.from(document.querySelectorAll('[data-scene]'));
    const scrollY = window.scrollY;
    this.anchors = nodes
      .map((node) => {
        const rect = node.getBoundingClientRect();
        return { key: node.dataset.scene, center: rect.top + scrollY + rect.height / 2 };
      })
      .sort((a, b) => a.center - b.center);
    this.docHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  }

  // ---------------------------------------------------------------- choreography

  targetState() {
    const states = SCENE_STATES[this.layout] || SCENE_STATES.wide;
    const fallback = states.home;
    const anchors = this.anchors;
    if (!anchors.length) return fallback;

    const probe = window.scrollY + window.innerHeight * 0.5;
    const stateOf = (anchor) => states[anchor.key] || fallback;
    if (probe <= anchors[0].center) return stateOf(anchors[0]);
    const last = anchors[anchors.length - 1];
    if (probe >= last.center) return stateOf(last);

    let index = 0;
    while (index < anchors.length - 1 && probe > anchors[index + 1].center) index += 1;
    const a = anchors[index];
    const b = anchors[index + 1];
    // Hold each pose while its section is centred, then glide to the next.
    const raw = (probe - a.center) / Math.max(1, b.center - a.center);
    const t = smooth(THREE.MathUtils.clamp((raw - 0.2) / 0.6, 0, 1));
    const from = stateOf(a);
    const to = stateOf(b);
    return {
      fx: THREE.MathUtils.lerp(from.fx, to.fx, t),
      fy: THREE.MathUtils.lerp(from.fy, to.fy, t),
      s: THREE.MathUtils.lerp(from.s, to.s, t),
      dim: THREE.MathUtils.lerp(from.dim, to.dim, t),
      tilt: THREE.MathUtils.lerp(from.tilt, to.tilt, t),
    };
  }

  snapToTarget() {
    this.current = { ...this.targetState(), dim: this.reducedMotion ? this.targetState().dim : 0 };
  }

  update(dt) {
    const target = this.targetState();
    for (const key of Object.keys(target)) {
      this.current[key] = this.reducedMotion ? target[key] : damp(this.current[key], target[key], key === 'dim' ? 2.2 : 3.2, dt);
    }

    const scrollY = window.scrollY;
    const scrollDelta = scrollY - this.lastScrollY;
    this.lastScrollY = scrollY;
    this.scrollVelocity = damp(this.scrollVelocity, Math.min(Math.abs(scrollDelta) / Math.max(dt, 0.001) / 2500, 1), 6, dt);
    const scrollFraction = scrollY / this.docHeight;

    // Visible extents at the focal plane (z = 0)
    const halfH = Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2)) * this.camera.position.z;
    const halfW = halfH * this.camera.aspect;
    const { fx, fy, s, dim, tilt } = this.current;
    const scale = (s * Math.min(halfW, halfH)) / SCULPTURE_RADIUS;

    this.anchor.position.set(fx * halfW, fy * halfH, 0);
    this.anchor.scale.setScalar(scale);

    // Section pose + slow idle spin (the sculpture no longer follows the mouse)
    this.tilt.rotation.x = tilt * 0.4;
    this.tilt.rotation.z = tilt * 0.25;
    if (!this.reducedMotion) {
      this.spin.rotation.y += 0.14 * dt;
      this.spin.rotation.x = Math.sin(this.time * 0.21) * 0.18;
      this.crystal.rotation.z += dt * 0.12;
      this.anchor.position.y += Math.sin(this.time * 0.8) * 0.06 * scale;
    }

    // Rings orbit; packets travel along each ring
    this.rings.forEach(({ spec, orbit, packets }) => {
      orbit.rotation.z = this.time * spec.speed * 0.35;
      const attribute = packets.geometry.attributes.position;
      for (let i = 0; i < spec.packets; i += 1) {
        const angle = this.time * spec.speed * 1.6 + (i / spec.packets) * Math.PI * 2;
        attribute.setXYZ(i, Math.cos(angle) * spec.radius, Math.sin(angle) * spec.radius, 0);
      }
      attribute.needsUpdate = true;
    });

    // Luminance (readability) + liveliness from scroll speed
    const pulse = 0.92 + Math.sin(this.time * 1.4) * 0.08;
    this.shellUniforms.uOpacity.value = dim * pulse;
    this.nodeUniforms.uOpacity.value = dim;
    this.shellUniforms.uAmp.value = 0.14 + this.scrollVelocity * 0.22;
    this.haloUniforms.uOpacity.value = dim;
    this.platformUniforms.uOpacity.value = dim * 0.9;
    this.edgeMaterial.opacity = 0.5 * dim;
    this.crystal.material.envMapIntensity = 0.25 + 1.15 * dim;
    this.crystal.visible = dim > 0.02;
    this.rings.forEach(({ lineMaterial, packetMaterial, baseOpacity }) => {
      lineMaterial.opacity = baseOpacity * dim;
      packetMaterial.uniforms.uOpacity.value = dim;
      packetMaterial.uniforms.uTime.value = this.time;
    });
    this.violetLight.intensity = 22 * dim;
    this.cyanLight.intensity = 16 * dim;
    this.violetLight.position.set(Math.cos(this.time * 0.5) * 2.4, 1.2, Math.sin(this.time * 0.5) * 2.4);
    this.cyanLight.position.set(Math.cos(this.time * 0.5 + Math.PI) * 2.4, -0.8, Math.sin(this.time * 0.5 + Math.PI) * 2.4);

    // Halo always faces the camera
    this.halo.quaternion.copy(this.camera.quaternion);

    // Starfield parallax: scroll drifts the field
    this.starField.rotation.y = this.time * 0.006 + scrollFraction * 0.5;
    this.starField.position.y = scrollFraction * 4;

    this.shellUniforms.uTime.value = this.time;
    this.starUniforms.uTime.value = this.time;
    this.haloUniforms.uTime.value = this.time;
    this.platformUniforms.uTime.value = this.time;
    this.backdropUniforms.uTime.value = this.time;
    this.backdropUniforms.uScroll.value = scrollFraction;
  }

  // ---------------------------------------------------------------- loop

  tick = () => {
    // Lower-powered devices render at ~30fps to keep scrolling smooth.
    this.pendingTime += this.clock.getDelta();
    if (this.pendingTime < this.frameInterval) return;
    const dt = Math.min(this.pendingTime, 1 / 20);
    this.pendingTime = 0;
    this.time += dt;
    this.update(dt);
    this.renderer.render(this.scene, this.camera);
    this.adaptQuality(dt);
    if (!this.readyFired) {
      this.readyFired = true;
      this.onReady?.();
    }
  };

  /** Drops resolution if the device can't hold ~45fps; never raises it back mid-session. */
  adaptQuality(dt) {
    if (this.time < 1.5 || this.dpr <= 1) return;
    this.frameSamples.push(dt);
    if (this.frameSamples.length < 90) return;
    const average = this.frameSamples.reduce((sum, value) => sum + value, 0) / this.frameSamples.length;
    this.frameSamples.length = 0;
    if (average > Math.max(1 / 45, this.frameInterval * 1.4)) {
      this.dpr = Math.max(1, this.dpr - 0.25);
      this.renderer.setPixelRatio(this.dpr);
      this.renderer.setSize(this.width, this.height, false);
    }
  }

  requestStaticRender() {
    if (this.staticFrame) return;
    this.staticFrame = requestAnimationFrame(() => {
      this.staticFrame = 0;
      this.update(1 / 60);
      this.renderer.render(this.scene, this.camera);
      if (!this.readyFired) {
        this.readyFired = true;
        this.onReady?.();
      }
    });
  }

  start() {
    if (this.reducedMotion) {
      this.requestStaticRender();
      return;
    }
    if (this.running || document.hidden) return;
    this.running = true;
    this.clock.getDelta();
    this.renderer.setAnimationLoop(this.tick);
  }

  stop() {
    this.running = false;
    this.renderer.setAnimationLoop(null);
  }

  dispose() {
    this.stop();
    cancelAnimationFrame(this.staticFrame);
    window.removeEventListener('scroll', this.handlers.scroll);
    document.removeEventListener('visibilitychange', this.handlers.visibility);
    this.canvas.removeEventListener('webglcontextlost', this.handlers.contextlost);
    this.resizeObserver.disconnect();
    this.disposables.forEach((item) => item.dispose?.());
    this.renderer.dispose();
  }
}
