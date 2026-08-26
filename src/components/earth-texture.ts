import * as THREE from "three";

/**
 * Procedurally draws a simplified equirectangular world map (ocean + rough
 * continent silhouettes + graticule) onto a canvas, for use as a sphere's
 * texture. Avoids depending on an external texture asset/download.
 */
export function createEarthTexture(): THREE.CanvasTexture {
  const width = 1024;
  const height = 512;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;

  const ocean = ctx.createLinearGradient(0, 0, 0, height);
  ocean.addColorStop(0, "#15296b");
  ocean.addColorStop(1, "#0a1130");
  ctx.fillStyle = ocean;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "rgba(127, 220, 255, 0.1)";
  ctx.lineWidth = 1;
  for (let lon = -180; lon <= 180; lon += 30) {
    const x = ((lon + 180) / 360) * width;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let lat = -90; lat <= 90; lat += 30) {
    const y = ((90 - lat) / 180) * height;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  const toXY = (lon: number, lat: number): [number, number] => [
    ((lon + 180) / 360) * width,
    ((90 - lat) / 180) * height,
  ];

  function landmass(lon: number, lat: number, rx: number, ry: number, alpha = 0.85) {
    const [x, y] = toXY(lon, lat);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "#7fdcff";
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  // Rough, stylized continent silhouettes (decorative, not cartographic).
  landmass(-105, 55, 70, 40); // North America
  landmass(-100, 32, 50, 26);
  landmass(-88, 18, 22, 12, 0.75); // Central America
  landmass(-60, -4, 34, 30); // South America
  landmass(-65, -28, 26, 30);
  landmass(18, 16, 44, 34); // Africa
  landmass(24, -18, 33, 28);
  landmass(14, 52, 28, 17); // Europe
  landmass(65, 52, 50, 22); // Asia
  landmass(95, 35, 58, 28);
  landmass(112, 12, 32, 18, 0.75); // SE Asia
  landmass(135, -25, 28, 15); // Australia

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
