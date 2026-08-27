import * as THREE from "three";

// Small hand-written replacement for @react-three/drei's <Trail>, which has
// no framework-agnostic equivalent. Keeps the last `length` sampled points of
// a moving target and renders them as a fading, additively-blended line.
export class Trail {
  constructor(scene, { length = 24, color = "#ffffff" } = {}) {
    this.length = length;
    this.points = [];
    this.geometry = new THREE.BufferGeometry();
    this.material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uColor: { value: new THREE.Color(color) } },
      vertexShader: `
        attribute float alpha;
        varying float vAlpha;
        void main() {
          vAlpha = alpha;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision mediump float;
        uniform vec3 uColor;
        varying float vAlpha;
        void main() {
          gl_FragColor = vec4(uColor, vAlpha);
        }
      `,
    });
    this.line = new THREE.Line(this.geometry, this.material);
    this.line.frustumCulled = false;
    scene.add(this.line);
  }

  push(point) {
    this.points.unshift(point.clone());
    if (this.points.length > this.length) this.points.length = this.length;

    const n = this.points.length;
    if (n < 2) return;

    const positions = new Float32Array(n * 3);
    const alphas = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const p = this.points[i];
      positions[i * 3] = p.x;
      positions[i * 3 + 1] = p.y;
      positions[i * 3 + 2] = p.z;
      const t = i / (n - 1);
      alphas[i] = Math.max(0, 1 - t) ** 2 * 0.9;
    }
    this.geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    this.geometry.setAttribute("alpha", new THREE.BufferAttribute(alphas, 1));
  }

  dispose(scene) {
    scene.remove(this.line);
    this.geometry.dispose();
    this.material.dispose();
  }
}
