/* NOOLAM - The Weave: live 3D fabric braid (Three.js)
   Flat, broad ribbons - not ropes. Each strand is a thin wide band that
   wraps helically around the braid spine, broad face outward, the way
   real fabric strips braid. */
import * as THREE from "../vendor/three.module.js";

const canvas = document.getElementById("braidCanvas");
const stage = canvas.parentElement;
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(36, 2, 0.1, 100);
camera.position.set(0, 0.15, 10.4);

const key = new THREE.DirectionalLight(0xfff3dd, 1.25);
key.position.set(3, 5, 6);
scene.add(key);
scene.add(new THREE.AmbientLight(0xfff0e0, 0.85));
const rim = new THREE.DirectionalLight(0xe0a92c, 0.55);
rim.position.set(-4, -2, 5);
scene.add(rim);

const group = new THREE.Group();
scene.add(group);

const texLoader = new THREE.TextureLoader();

let strands = [];
let grow = 0;
const clock = new THREE.Clock();
let phase = 0;

const LEN = 13.2;          // spine length
const RADIUS = 0.52;       // strand orbit radius around spine
const WIDTH = 0.98;        // ribbon width (broad fabric band)
const THICK = 0.045;       // ribbon thickness (thin)
const TURNS = 2.35;        // braid twists along the spine
const SAMPLES = 240;

// Center of strand i at parameter t in [0,1]
function strandCenter(t, i, n, out) {
  const x = (t - 0.5) * LEN;
  const angle = t * TURNS * Math.PI * 2 + (i * Math.PI * 2) / Math.max(n, 1);
  const r = n === 1 ? 0 : RADIUS;
  // gentle drape: middle of the braid sags, ends lift and curl down softly
  const sag = -Math.sin(t * Math.PI) * 0.55;
  const endCurl = -Math.pow(Math.abs(t - 0.5) * 2, 3) * 0.55;
  out.set(x, Math.cos(angle) * r + sag + endCurl, Math.sin(angle) * r);
  return angle;
}

// Build one ribbon as a thin rectangular prism strip following the strand path.
// Broad face points radially outward so the fabric print reads from outside.
function ribbonGeometry(i, n) {
  const verts = [], norms = [], uvs = [], idx = [];
  const c = new THREE.Vector3(), c2 = new THREE.Vector3();
  const T = new THREE.Vector3(), W = new THREE.Vector3(), N = new THREE.Vector3();

  for (let k = 0; k <= SAMPLES; k++) {
    const t = k / SAMPLES;
    const angle = strandCenter(t, i, n, c);
    strandCenter(Math.min(t + 1 / SAMPLES, 1), i, n, c2);
    T.subVectors(c2, c).normalize();
    if (k === SAMPLES) { strandCenter(t - 1 / SAMPLES, i, n, c2); T.subVectors(c, c2).normalize(); }

    // radial outward direction from the braid spine at this point
    W.set(0, Math.cos(angle), Math.sin(angle));
    // slight natural flutter of the band around its own length axis
    const flutter = Math.sin(t * Math.PI * 7 + i * 2.1) * 0.22;
    W.applyAxisAngle(T, flutter).normalize();
    N.crossVectors(T, W).normalize();

    const hw = WIDTH / 2, ht = THICK / 2;
    // four corners: +-width, +-thickness
    const corners = [
      [ hw,  ht], [ hw, -ht], [-hw, -ht], [-hw,  ht],
    ];
    const cornerNorm = [N, N.clone().negate(), N.clone().negate(), N];
    for (let q = 0; q < 4; q++) {
      const [w, h] = corners[q];
      verts.push(
        c.x + W.x * w + N.x * h,
        c.y + W.y * w + N.y * h,
        c.z + W.z * w + N.z * h
      );
      const nn = cornerNorm[q];
      norms.push(nn.x, nn.y, nn.z);
      uvs.push(t * 7, q < 2 ? 1 : 0); // u along length (repeats), v across width
    }
  }
  // side strips between corner rings: quad (0,1,2,3) per sample
  for (let k = 0; k < SAMPLES; k++) {
    const a = k * 4, b = (k + 1) * 4;
    for (let e = 0; e < 4; e++) {
      const e2 = (e + 1) % 4;
      idx.push(a + e, b + e, b + e2, a + e, b + e2, a + e2);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
  geo.setAttribute("normal", new THREE.Float32BufferAttribute(norms, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(idx);
  return geo;
}

function buildBraid(textures) {
  strands.forEach((m) => { m.geometry.dispose(); m.material.map?.dispose(); m.material.dispose(); group.remove(m); });
  strands = [];
  const n = textures.length;
  if (!n) return;
  grow = 0;

  for (let i = 0; i < n; i++) {
    const geo = ribbonGeometry(i, n);
    const tex = texLoader.load(textures[i], () => { if (reduced) renderer.render(scene, camera); });
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 1);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    const mat = new THREE.MeshStandardMaterial({
      map: tex, roughness: 0.62, metalness: 0.1, side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.scale.setScalar(0.001);
    group.add(mesh);
    strands.push(mesh);
  }
  if (reduced) { strands.forEach((m) => m.scale.setScalar(1)); renderer.render(scene, camera); }
}

window.addEventListener("noolam:weave", (e) => {
  buildBraid(e.detail.textures || []);
});

function resize() {
  const w = stage.clientWidth, h = stage.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  if (reduced) renderer.render(scene, camera);
}
new ResizeObserver(resize).observe(stage);
resize();

function frame(dt) {
  phase += dt * 0.5;
  grow = Math.min(grow + dt * 0.85, 1);
  const ease = 1 - Math.pow(1 - grow, 3);
  strands.forEach((m, i) => {
    m.scale.setScalar(Math.max(0.001, Math.min(1, ease * 1.25 - i * 0.14)));
    // slow flow of the weave along each band, like fabric being pulled through
    if (m.material.map) m.material.map.offset.x -= dt * 0.045;
  });
  group.rotation.y = Math.sin(phase * 0.45) * 0.2;
  group.rotation.x = 0.1 + Math.sin(phase * 0.32) * 0.045;
  group.rotation.z = Math.sin(phase * 0.26) * 0.05;
  group.position.y = Math.sin(phase * 0.6) * 0.06;
  renderer.render(scene, camera);
}

if (reduced) {
  frame(0.016);
} else {
  renderer.setAnimationLoop(() => frame(Math.min(clock.getDelta(), 0.05)));
}
