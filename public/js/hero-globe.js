import * as THREE from "three";
import { OrbitControls } from "/vendor/three/examples/jsm/controls/OrbitControls.js";
import { createEarthTexture } from "./earth-texture.js";
import { Trail } from "./trail.js";
import { PACKAGES } from "./data/packages.js";
import { DESTINATION_SCENES } from "./data/destination-scenes.js";

const SCENE_INTERVAL_MS = 2600;
const SCENE_SWAP_MS = 280;

// A pin's floating card: a small illustrated "photo" that shuffles through
// a destination's scenes (stand-ins for real photography, see
// data/destination-scenes.js) plus a city/title caption underneath.
function createPinCard(pkg) {
  const scenes = DESTINATION_SCENES[pkg.slug] || [];

  const el = document.createElement("div");
  el.className = "globe-pin-card pointer-events-none absolute left-0 top-0";
  el.innerHTML = `
    ${scenes.length > 0 ? '<div class="globe-pin-photo"><div class="globe-pin-scene"></div></div>' : ""}
    <div class="globe-city-label">
      <span class="globe-city-label-text">
        <span class="globe-city-label-title"></span>
        <span class="globe-city-label-sub"></span>
      </span>
    </div>
  `;
  el.querySelector(".globe-city-label-title").textContent = pkg.destination.split(",")[0];

  const subEl = el.querySelector(".globe-city-label-sub");
  const sceneEl = el.querySelector(".globe-pin-scene");
  let index = 0;

  function render() {
    const scene = scenes[index % scenes.length];
    if (sceneEl) sceneEl.innerHTML = scene.svg;
    subEl.textContent = scenes.length > 0 ? scene.title : pkg.title;
  }
  render();

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let timer = null;
  if (scenes.length > 1 && !reduceMotion) {
    timer = window.setInterval(() => {
      sceneEl.classList.add("is-swapping");
      window.setTimeout(() => {
        index += 1;
        render();
        sceneEl.classList.remove("is-swapping");
      }, SCENE_SWAP_MS);
    }, SCENE_INTERVAL_MS);
  }

  return { el, dispose: () => timer !== null && window.clearInterval(timer) };
}

let cachedWebGLSupport = null;

export function detectWebGL() {
  if (cachedWebGLSupport !== null) return cachedWebGLSupport;
  try {
    const canvas = document.createElement("canvas");
    cachedWebGLSupport = Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")),
    );
  } catch {
    cachedWebGLSupport = false;
  }
  return cachedWebGLSupport;
}

function orbitPoint(angle, radius, out) {
  out.set(Math.cos(angle) * radius, Math.sin(angle * 2) * 0.06, Math.sin(angle) * radius);
  return out;
}

const FLIGHT_CONFIGS = [
  { radius: 2.1, speed: 0.16, tilt: [0.45, 0, 0.3], phase: 0, color: "#7fdcff" },
  { radius: 2.4, speed: -0.11, tilt: [-0.3, 0.5, -0.2], phase: 2.1, color: "#a5e6ff" },
  { radius: 1.85, speed: 0.13, tilt: [0.15, -0.6, 0.5], phase: 4.2, color: "#5fb8e8" },
];

class FlightLoop {
  constructor(scene, config) {
    this.config = config;
    this.angle = config.phase;
    this.target = new THREE.Vector3();

    this.tiltGroup = new THREE.Group();
    this.tiltGroup.rotation.set(...config.tilt);
    scene.add(this.tiltGroup);

    this.planeGroup = new THREE.Group();
    this.tiltGroup.add(this.planeGroup);

    const coneOrient = new THREE.Group();
    coneOrient.rotation.set(-Math.PI / 2, 0, 0);
    this.planeGroup.add(coneOrient);

    const cone = new THREE.Mesh(
      new THREE.ConeGeometry(0.045, 0.22, 6),
      new THREE.MeshStandardMaterial({
        color: "#ffffff",
        emissive: config.color,
        emissiveIntensity: 0.6,
      }),
    );
    coneOrient.add(cone);

    this.trail = new Trail(this.tiltGroup, { color: config.color });
  }

  update(delta) {
    this.angle += delta * this.config.speed;
    orbitPoint(this.angle, this.config.radius, this.planeGroup.position);
    orbitPoint(
      this.angle + Math.sign(this.config.speed || 1) * 0.01,
      this.config.radius,
      this.target,
    );
    this.planeGroup.lookAt(this.target);
    this.planeGroup.rotateZ(0.3);
    this.trail.push(this.planeGroup.position);
  }

  dispose(scene) {
    this.trail.dispose(this.tiltGroup);
    scene.remove(this.tiltGroup);
  }
}

const GLOBE_RADIUS = 1.4;

// Where each destination's marker sits on the globe. Spaced evenly around
// longitude (independent of real-world coordinates, since the earth texture
// itself is a stylized, non-cartographic map) so markers face the camera at
// a steady, evenly-paced cadence as the globe spins — rather than bunching
// up if real longitudes were used.
const DESTINATION_LAYOUT = [
  { slug: "dubai-city-escape", lat: 22, lon: 0 },
  { slug: "classic-london", lat: 48, lon: 90 },
  { slug: "east-africa-safari", lat: -12, lon: 180 },
  { slug: "complete-umrah-package", lat: 18, lon: 270 },
];

function latLonToVector3(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

function createDestinationMarkers(globe) {
  return DESTINATION_LAYOUT.map(({ slug, lat, lon }) => {
    const pkg = PACKAGES.find((p) => p.slug === slug);
    if (!pkg) return null;

    const position = latLonToVector3(lat, lon, GLOBE_RADIUS * 1.005);
    const group = new THREE.Group();
    group.position.copy(position);
    group.lookAt(position.clone().multiplyScalar(2));

    const dot = new THREE.Mesh(
      new THREE.SphereGeometry(0.048, 16, 16),
      new THREE.MeshBasicMaterial({ color: "#ffffff" }),
    );
    group.add(dot);

    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.065, 0.1, 24),
      new THREE.MeshBasicMaterial({
        color: "#7fdcff",
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    group.add(ring);

    globe.add(group);
    return { pkg, group, direction: position.clone().normalize(), pulse: Math.random() * Math.PI * 2 };
  }).filter(Boolean);
}

export function mountHeroGlobe(container) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 5);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xffffff, 0.9));
  const directional = new THREE.DirectionalLight("#7fdcff", 1.3);
  directional.position.set(3, 2, 4);
  scene.add(directional);
  const point = new THREE.PointLight("#34b8f0", 0.5);
  point.position.set(-3, -2, -2);
  scene.add(point);

  const globe = new THREE.Mesh(
    new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64),
    new THREE.MeshStandardMaterial({
      map: createEarthTexture(),
      metalness: 0.15,
      roughness: 0.65,
    }),
  );
  scene.add(globe);

  const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(GLOBE_RADIUS, 32, 32),
    new THREE.MeshBasicMaterial({
      color: "#34b8f0",
      transparent: true,
      opacity: 0.16,
      side: THREE.BackSide,
    }),
  );
  atmosphere.scale.setScalar(1.06);
  scene.add(atmosphere);

  const flights = FLIGHT_CONFIGS.map((config) => new FlightLoop(scene, config));
  const markers = createDestinationMarkers(globe);
  container.style.position = container.style.position || "relative";
  const labelLayer = document.createElement("div");
  labelLayer.className = "pointer-events-none absolute inset-0 z-20 overflow-hidden";
  container.appendChild(labelLayer);
  const pinCards = markers.map((marker) => {
    const card = createPinCard(marker.pkg);
    labelLayer.appendChild(card.el);
    return card;
  });
  const cityLabels = pinCards.map((card) => card.el);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.autoRotate = false;

  function resize() {
    const width = container.clientWidth || 1;
    const height = container.clientHeight || 1;
    // updateStyle defaults to true so the canvas's CSS size matches the
    // container in CSS pixels — the internal drawing buffer still scales by
    // devicePixelRatio via setPixelRatio above. Omitting this (passing
    // false) leaves the canvas's layout size at its raw pixel-buffer
    // dimensions, which overflows the container on any display with
    // pixel-ratio scaling above 1.
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);
  resize();

  const timer = new THREE.Timer();
  timer.connect(document);
  let frameId = null;
  const markerWorldPos = new THREE.Vector3();
  const markerWorldDir = new THREE.Vector3();
  const cameraDir = new THREE.Vector3();
  const screenPos = new THREE.Vector3();

  // Each pin fades its own label in as it rotates into view and back out as
  // it rotates away — no separate fixed info card. Threshold set so
  // typically only the one or two pins nearest the front are visible at
  // once, rather than several labels cluttering the globe simultaneously.
  function updatePinLabels() {
    if (markers.length === 0) return;

    const width = container.clientWidth || 1;
    const height = container.clientHeight || 1;

    cameraDir.copy(camera.position).normalize();
    markers.forEach((marker, i) => {
      marker.group.getWorldPosition(markerWorldPos);
      markerWorldDir.copy(markerWorldPos).normalize();
      const score = markerWorldDir.dot(cameraDir);

      const ring = marker.group.children[1];
      ring.material.opacity = 0.5 + Math.max(score, 0) * 0.5;

      const label = cityLabels[i];
      if (label) {
        screenPos.copy(markerWorldPos).project(camera);
        const x = (screenPos.x * 0.5 + 0.5) * width;
        const y = (-screenPos.y * 0.5 + 0.5) * height;
        label.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, calc(-100% - 14px))`;
        label.style.opacity = Math.max(0, Math.min(1, (score - 0.05) / 0.55)).toFixed(2);
      }
    });
  }

  function animate(timestamp) {
    frameId = requestAnimationFrame(animate);
    timer.update(timestamp);
    const delta = timer.getDelta();
    const elapsed = timer.getElapsed();
    globe.rotation.y += delta * 0.045;
    for (const flight of flights) flight.update(delta);
    for (const marker of markers) {
      const scale = 1 + Math.sin(elapsed * 2 + marker.pulse) * 0.12;
      marker.group.children[1].scale.setScalar(scale);
    }
    controls.update();
    renderer.render(scene, camera);
    updatePinLabels();
  }
  animate();

  return {
    destroy() {
      if (frameId != null) cancelAnimationFrame(frameId);
      timer.dispose();
      resizeObserver.disconnect();
      controls.dispose();
      for (const flight of flights) flight.dispose(scene);
      for (const marker of markers) globe.remove(marker.group);
      for (const card of pinCards) card.dispose();
      if (labelLayer.parentNode === container) container.removeChild(labelLayer);
      globe.geometry.dispose();
      globe.material.map?.dispose();
      globe.material.dispose();
      atmosphere.geometry.dispose();
      atmosphere.material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    },
  };
}
