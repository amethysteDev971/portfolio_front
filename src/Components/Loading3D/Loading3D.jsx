import React, { useEffect, useRef, useState } from 'react';
import './Loading3D.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import gsap from 'gsap';
// import GUI from 'lil-gui'; // Debug GUI désactivé
import { FontLoader } from 'three/examples/jsm/Addons.js';
import { TextGeometry } from 'three/examples/jsm/Addons.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

let rendererGlobal = null;

export default function Loading3D() {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const [showScrollArrows, setShowScrollArrows] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Crée une texture de dégradé pour le fond de la scène
  const createGradientTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB');  // Bleu ciel
    gradient.addColorStop(0.3, '#87CEEB');  // Bleu acier
    gradient.addColorStop(0.7, '#87CEEB');
    gradient.addColorStop(1, '#00008B');    // Bleu profond
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    return new THREE.CanvasTexture(canvas);
  };

  // Fonction de scroll vers le bas
  function handleScrollDown() {
    window.scrollBy({ top: 600, behavior: 'smooth' });
  }

  useEffect(() => {
    const axesOrigin = { xInherit: 1.4, yInherit: -0.75, zInherit: -32 };
    const debugObject = {};

    // Création de la scène
    const scene = new THREE.Scene();
    scene.background = createGradientTexture();
    sceneRef.current = scene;

    // Création de la caméra
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / 600,
      0.1,
      500
    );
    camera.position.set(
      axesOrigin.xInherit,
      axesOrigin.yInherit,
      axesOrigin.zInherit
    );
    const clock = new THREE.Clock();

    // Création du renderer
    if (!rendererGlobal) {
      rendererGlobal = new THREE.WebGLRenderer({ antialias: true });
      rendererGlobal.setSize(window.innerWidth, 600);
      rendererGlobal.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
    // On force le canvas à être en position absolue et à avoir un z-index bas
    if (mountRef.current && !mountRef.current.contains(rendererGlobal.domElement)) {
      mountRef.current.appendChild(rendererGlobal.domElement);
      rendererGlobal.domElement.style.position = 'absolute';
      rendererGlobal.domElement.style.top = '0';
      rendererGlobal.domElement.style.left = '0';
      rendererGlobal.domElement.style.zIndex = '1';
    }
    const renderer = rendererGlobal;

    // Ajout des lumières
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x4cffff, 1.5);
    directionalLight.position.set(0, 10, 5);
    scene.add(directionalLight);
    directionalLight.castShadow = true;

    const hemisphereLight = new THREE.HemisphereLight(0x0000fc, 0x0000ff, 2);
    hemisphereLight.position.set(0, 1.8, -6);
    scene.add(hemisphereLight);

    const pointLight = new THREE.PointLight(0xffff4c, 3, 5);
    pointLight.position.set(0, 3, -6.2);
    scene.add(pointLight);

    // --- Utilisation de DRACOLoader pour alléger le modèle ---
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/'); // Les fichiers du décodeur doivent être dans public/draco/
    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      'Island_project2_export_compressed.glb', // Version compressée
      function (gltf) {
        // Simule un long temps de chargement : 5 secondes
        setTimeout(() => {
          gltf.scene.scale.set(3.3, 3.3, 3.3);
          gltf.scene.position.set(0, -10, 0);
          gltf.scene.rotation.y = Math.PI;
          scene.add(gltf.scene);
          camera.lookAt(gltf.scene.position);
          debugObject.spin = () => {
            gsap.to(gltf.scene.rotation, {
              duration: 1,
              y: gltf.scene.rotation.y + Math.PI,
            });
          };
          if (window.innerWidth < 768) {
            gsap.to(gltf.scene.position, {
              duration: 1,
              z: 8, // Ajuste selon tes besoins
              x: 2,
              ease: "power1.inOut"
            });
          }
          setModelLoaded(true);

          // Lance la transition du container dès que le modèle est chargé
          gsap.to(mountRef.current, {
            duration: 1,
            scale: 0.95,
            y: 80,
            borderRadius: "20px",
            marginBottom: "90px",
            backgroundColor: "#A371DE",
            border: "8px solid white",
            boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3)",
            ease: "elastic.out(1, 0.3)",
            onComplete: () => setShowScrollArrows(true)
          });
        }, 200);
      },
      function (xhr) {
        if (xhr.total) {
          const progress = (xhr.loaded / xhr.total) * 100;
          setLoadingProgress(progress);
        }
      },
      function (error) {
        console.error('Erreur lors du chargement du modèle :', error);
      }
    );
    // ----------------------------------------------------

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = false;
    const distance = camera.position.distanceTo(controls.target);
    controls.minDistance = distance;
    controls.maxDistance = distance;
    controls.minPolarAngle = Math.PI / 2.25;
    controls.maxPolarAngle = Math.PI / 2;

    // Lancement de l'animation de la caméra (peut être lancée dès maintenant)
    gsap.to(camera.position, {
      duration: 5,
      x: 5.2,
      ease: 'power1.inOut',
      repeat: -1,
      yoyo: true,
    });

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / 600;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, 600);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (
        process.env.NODE_ENV !== 'development' &&
        mountRef.current &&
        mountRef.current.contains(renderer.domElement)
      ) {
        mountRef.current.removeChild(renderer.domElement);
        renderer.dispose();
        rendererGlobal = null;
      }
      controls.dispose();
    };
  }, []);

  // Ajout du texte "PORTFOLIO" uniquement après que le modèle soit chargé
  useEffect(() => {
    if (modelLoaded && sceneRef.current) {
      const fontLoader = new FontLoader();
      fontLoader.load('fonts/Righteous/Righteous_Regular.json', (font) => {
        const textGeometry = new TextGeometry('PORTFOLIO', {
          font: font,
          size: 2.5,
          depth: 1.15,
          curveSegments: 12,
          bevelEnabled: true,
          bevelThickness: 0.03,
          bevelSize: 0.02,
          bevelOffset: 0,
          bevelSegments: 5,
        });
        const textMaterial = new THREE.MeshStandardMaterial({ color: 0xfffff0 });
        const text = new THREE.Mesh(textGeometry, textMaterial);
        text.position.set(10, -1.9, -2);
        text.rotateY(Math.PI - 0.125);
        sceneRef.current.add(text);

        // Sur mobile, anime le texte pour qu'il se déplace (pour être entièrement visible)
        if (window.innerWidth < 768) {
          gsap.to(text.position, {
            duration: 1,
            z: 8,
            x: '-=0.8',
            ease: "power1.inOut"
          });
        }
      });
    }
  }, [modelLoaded]);

  // Animation des flèches : timeline en boucle
  useEffect(() => {
    let tl;
    if (showScrollArrows) {
      tl = gsap.timeline({ repeat: -1 });
      tl.fromTo(
        ".scroll-down .arrow",
        { opacity: 0, y: -10 },
        { opacity: 1, y: 10, duration: 0.8, ease: "bounce.out", stagger: 0.1 }
      )
        .to(
          ".scroll-down .arrow",
          { y: 0, duration: 0.4, ease: "power1.inOut", stagger: 0.1 },
          "+=0.2"
        )
        .to(
          ".scroll-down .arrow",
          { opacity: 0, duration: 0.4, ease: "power1.out", stagger: 0.1 },
          "+=0.2"
        );
    }
    return () => {
      if (tl) tl.kill();
    };
  }, [showScrollArrows]);

  return (
    <div className="webgl" ref={mountRef} style={{ width: '100vw', height: '600px' }}>
      {/* Barre de progression avec pourcentage affiché tant que le modèle n'est pas chargé */}
      {!modelLoaded && (
        <div className="loading-gauge">
          <div className="loading-bar" style={{ width: `${loadingProgress}%` }}></div>
          <div className="loading-text">{loadingProgress.toFixed(0)}%</div>
        </div>
      )}
      {showScrollArrows && (
        <div className="scroll-down" onClick={handleScrollDown}>
          <div className="arrow arrow-top">
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7 7 7-7"/>
            </svg>
          </div>
          <div className="arrow arrow-bottom">
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path style={{ transform: 'translateY(-12px)' }} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7 7 7-7"/>
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}

function handleScrollDown() {
  window.scrollBy({ top: 600, behavior: 'smooth' });
}
