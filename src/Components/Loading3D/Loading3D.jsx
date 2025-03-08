import React, { useEffect, useRef } from 'react';
import './Loading3D.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import gsap from 'gsap';
import GUI from 'lil-gui';

let rendererGlobal = null;

export default function Loading3D() {
  const mountRef = useRef(null);
  const guiRef = useRef(null);

  useEffect(() => {
    // Création unique de la GUI
    if (!guiRef.current) {
      guiRef.current = new GUI({ title: 'Debug', width: 300 });
    }

    // Gestion de la touche "h" pour basculer l'affichage du GUI
    const handleKeyDown = (event) => {
      if (event.key === 'h' && guiRef.current) {
        // On vérifie la propriété display du domElement
        if (guiRef.current.domElement.style.display === 'none') {
          guiRef.current.show(); // Affiche la GUI
          console.log('GUI affichée');
        } else {
          guiRef.current.hide(); // Masque la GUI
          console.log('GUI masquée');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Initialisation de la scène, de la caméra, etc.
    const axesOrigin = { xInherit: -2.97, yInherit: 3.12, zInherit: -6.45 };
    const debugObject = {};
    const scene = new THREE.Scene();
    // scene.background = new THREE.Color(0xEB4D55);
    scene.background = new THREE.Color(0x87CEEB);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / 600,
      0.1,
      1000
    );
    camera.position.set(
      axesOrigin.xInherit,
      axesOrigin.yInherit,
      axesOrigin.zInherit
    );
    camera.lookAt(0, 0, 0);
    const clock = new THREE.Clock();

    // Configuration de la GUI
    const cameraTweaks = guiRef.current.addFolder('Caméra');
    const objetTweaks = guiRef.current.addFolder('Objet');
    cameraTweaks
      .add(camera.position, 'x')
      .min(-10)
      .max(10)
      .step(0.01)
      .name('caméra x');
    cameraTweaks
      .add(camera.position, 'y')
      .min(-10)
      .max(10)
      .step(0.01)
      .name('caméra y');
    cameraTweaks
      .add(camera.position, 'z')
      .min(-100)
      .max(100)
      .step(0.01)
      .name('caméra z');

    // Ajout d'un AxesHelper
    const axesHelper = new THREE.AxesHelper(15);
    scene.add(axesHelper);

    // Création (ou récupération) du renderer unique
    if (!rendererGlobal) {
      rendererGlobal = new THREE.WebGLRenderer({ antialias: true });
      rendererGlobal.setSize(window.innerWidth, 600);
      rendererGlobal.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
    if (mountRef.current && !mountRef.current.contains(rendererGlobal.domElement)) {
      mountRef.current.appendChild(rendererGlobal.domElement);
    }
    const renderer = rendererGlobal; // Pour simplifier

    // Lumières
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.7);
    scene.add(ambientLight);
    const lightsTweaks = guiRef.current.addFolder('Lights');
    lightsTweaks
      .add(ambientLight, 'intensity')
      .min(0)
      .max(3)
      .step(0.001);

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

    // Chargement du modèle GLTF
    const loader = new GLTFLoader();
    loader.load(
      'Island_project2_export.glb',
      function (gltf) {
        gltf.scene.scale.set(1.3, 1.3, 1.3);
        gltf.scene.position.set(0, 0, 0);
        gltf.scene.rotation.y = Math.PI;
        scene.add(gltf.scene);
        debugObject.spin = () => {
          gsap.to(gltf.scene.rotation, {
            duration: 1,
            y: gltf.scene.rotation.y + Math.PI,
          });
        };
        objetTweaks.add(debugObject, 'spin').name('Spin');
      },
      undefined,
      function (error) {
        console.error('Erreur lors du chargement du modèle :', error);
      }
    );

    // Contrôles de la caméra
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = false; // Désactive le zoom via la molette

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    debugObject.traveling = () => {
      if (camera.position.x < 5.2) {
        gsap.to(camera.position, { duration: 1, x: 5.2 });
      } else {
        gsap.to(camera.position, { duration: 1, x: axesOrigin.xInherit });
      }
    };
    cameraTweaks.add(debugObject, 'traveling').name('Traveling');

    // Gestion du redimensionnement
    const handleResize = () => {
      camera.aspect = window.innerWidth / 600;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, 600);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
      if (process.env.NODE_ENV !== 'development' && mountRef.current && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
        renderer.dispose();
        rendererGlobal = null;
      }
      controls.dispose();
      if (guiRef.current) {
        guiRef.current.destroy();
        guiRef.current = null;
      }
    };
  }, []);

  return <div className='webgl' ref={mountRef} style={{ width: '100vw', height: '600px' }} />;
}
