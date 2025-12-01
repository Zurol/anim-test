/* ======================================================
   THREE.JS
====================================================== */
const canvas = document.getElementById("canvas");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

camera.position.z = 3;

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = false;

const loader = new THREE.TextureLoader();

/* ---------------- CUBO ---------------- */
const cubeGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const cubeMat = new THREE.MeshNormalMaterial();
const cube = new THREE.Mesh(cubeGeo, cubeMat);
cube.position.set(3, 1, 0);
//scene.add(cube);

/* ---------------- IMG 0 ---------------- */
const tex0 = loader.load("images/LogoWhite.png");
const img0 = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1),
  new THREE.MeshBasicMaterial({ map: tex0, transparent: true })
);
img0.position.set(0, 1, 0.1);
scene.add(img0);

/* ---------------- IMG 1 ---------------- */
const tex1 = loader.load("images/img1.png");
const img1 = new THREE.Mesh(
  new THREE.PlaneGeometry(12, 6),
  new THREE.MeshBasicMaterial({ map: tex1, transparent: true })
);
img1.position.set(0, 0, 0);
scene.add(img1);

// Imagen 2 (parallax atrás)
const tex2 = loader.load("images/img2.png");
const img2 = new THREE.Mesh(
  new THREE.PlaneGeometry(12, 6),
  new THREE.MeshBasicMaterial({ map: tex2, transparent: true })
);

//img2.position.set(0, 0, 0);
img2.position.set(0, 0, 2.9);
img2.scale.set(2, 2, 2); // ← 200%
img2.material.opacity = 0.1; // ← visible totalmente desde el inicio si quieres

scene.add(img2);

// Imagen 3 (parallax + fade in)
const tex3 = loader.load("images/img3.png");
const img3 = new THREE.Mesh(
  new THREE.PlaneGeometry(12, 6),
  new THREE.MeshBasicMaterial({ map: tex3, transparent: true })
);

img3.position.set(0, 0, 2.9);
img3.scale.set(2, 2, 2); // ← Igual que imagen 2
img3.material.opacity = 0; // ← Comienza invisible

scene.add(img3);

/* ---------------- IMG Black ---------------- */
const texB = loader.load("images/Black.png");
const imgB = new THREE.Mesh(
  new THREE.PlaneGeometry(12, 6),
  new THREE.MeshBasicMaterial({ map: texB, transparent: true })
);
imgB.material.opacity = 0;
imgB.position.set(0, 0, 0.1);
scene.add(imgB);

/* ---------------- IMG 4 ---------------- */
const tex4 = loader.load("images/img4.png");
const img4 = new THREE.Mesh(
  new THREE.PlaneGeometry(6, 3),
  new THREE.MeshBasicMaterial({ map: tex4, transparent: true })
);
img4.material.opacity = 0;
img4.position.set(0, -0.25, 0.1);
scene.add(img4);

/* ======================================================
   RESIZE
====================================================== */
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

/* ======================================================
   GSAP TIMELINE
====================================================== */

let animProgress = 0; // 0 = inicio, 1 = final

const tl = gsap.timeline({ paused: true });

/* Cubo */
//tl.to(cube.rotation, { y: -Math.PI * 2, ease: "none", duration: 1 }, 0);

tl.to(img0.material, { opacity: 0, ease: "none", duration: 0.25 }, 0);

/* Parallax imagen 1 */
tl.to(img1.scale, { x: 0.8, y: 0.8, ease: "none", duration: 0.2 }, 0);

/* Parallax imagen 2 */
tl.to(img2.position, { z: 0, ease: "none", duration: 0.2 }, 0.2);
tl.to(img3.position, { z: 0, ease: "none", duration: 0.2 }, 0.2);

tl.to(img2.scale, { x: 0.75, y: 0.75, ease: "none", duration: 0.5 }, 0);
tl.to(img3.scale, { x: 0.75, y: 0.75, ease: "none", duration: 0.5 }, 0);
tl.to(img4.scale, { x: 0.75, y: 0.75, ease: "none", duration: 0.5 }, 0);

tl.to(img2.material, { opacity: 1, ease: "none", duration: 0.3 }, 0.2);
tl.to(img3.material, { opacity: 1, ease: "none", duration: 0.3 }, 0.3);

tl.to(imgB.material, { opacity: 1, ease: "none", duration: 0.2 }, 0.5);
tl.to(img4.material, { opacity: 1, ease: "none", duration: 0.2 }, 0.7);
tl.to(img4.position, { y: 0.5, ease: "none", duration: 0.2 }, 0.7);

/* ======================================================
   CONTROL DE SCROLL SIN BLOQUEOS
====================================================== */

document.body.style.overflow = "hidden"; // bloqueo inicial

window.addEventListener(
  "wheel",
  (e) => {
    const goingDown = e.deltaY > 0;

    /* ---------------------------------------
       1) ANIMACIÓN TERMINÓ → SCROLL NORMAL
    ---------------------------------------- */
    if (animProgress === 1) {
      document.body.style.overflow = "auto";
      return; // dejar pasar scroll
    }

    /* ---------------------------------------
       2) NO ESTÁS EN EL HERO → NADA DE ANIMACIÓN
    ---------------------------------------- */
    if (window.scrollY > 5) {
      return; // scroll normal
    }

    /* ---------------------------------------
       3) ESTÁS EN EL HERO → CONTROLAR ANIMACIÓN
    ---------------------------------------- */
    e.preventDefault();
    document.body.style.overflow = "hidden";

    animProgress += e.deltaY * 0.0005;
    animProgress = gsap.utils.clamp(0, 1, animProgress);

    tl.progress(animProgress);

    /* Llega al final → liberar */
    if (animProgress === 1) {
      document.body.style.overflow = "auto";
    }

    /* Regresa al inicio → bloquear scroll */
    if (animProgress === 0) {
      document.body.style.overflow = "hidden";
      window.scrollTo({ top: 0 });
    }
  },
  { passive: false }
);

/* ======================================================
   LOOP
====================================================== */
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
