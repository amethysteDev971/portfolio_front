import React, { useEffect, useRef } from 'react';

const CursorTrail = ({ containerRef }) => {
  const canvasRef = useRef(null);
  const mousePos = { x: 0, y: 0 };
  const numCircles = 20;
  const lastMoveRef = useRef(Date.now());
  const globalOpacityRef = useRef(0); // Départ à 0 pour être invisible

  useEffect(() => {
    if (!containerRef || !containerRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Redimensionne le canvas pour qu'il couvre exactement le conteneur
    const resizeCanvas = () => {
      if (containerRef.current) {
        canvas.width = containerRef.current.clientWidth;
        canvas.height = containerRef.current.clientHeight;
      }
    };
    // On attend un cycle d'animation pour s'assurer que le conteneur est rendu
    requestAnimationFrame(resizeCanvas);
    
    // Observer les changements de taille du conteneur
    const observer = new ResizeObserver(() => {
      resizeCanvas();
    });
    observer.observe(containerRef.current);

    // Initialise le tableau des cercles de la traînée
    const circles = [];
    for (let i = 0; i < numCircles; i++) {
      circles.push({ x: 0, y: 0, opacity: (i + 1) / numCircles });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const now = Date.now();
      // Si plus de 500ms sans mouvement, on réduit progressivement l'opacité globale
      if (now - lastMoveRef.current > 500) {
        globalOpacityRef.current = Math.max(0, globalOpacityRef.current - 0.02);
      }
      let x = mousePos.x;
      let y = mousePos.y;
      circles.forEach((circle, i) => {
        // Animation fluide : chaque cercle se rapproche de la position précédente
        circle.x += (x - circle.x) * 0.3;
        circle.y += (y - circle.y) * 0.3;

        ctx.beginPath();
        const radius = 8 + i * 0.6;
        ctx.arc(circle.x, circle.y, radius, 0, Math.PI * 2);
        // La couleur intègre la globalOpacity pour faire disparaître l'effet progressivement
        ctx.fillStyle = `rgba(140, 0, 255, ${circle.opacity * 0.3 * globalOpacityRef.current})`;
        ctx.fill();

        x = circle.x;
        y = circle.y;
      });
      requestAnimationFrame(animate);
    };

    animate();

    // Utilise e.currentTarget pour obtenir des coordonnées relatives précises
    const handleMouseMove = (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      mousePos.x = e.clientX - rect.left;
      mousePos.y = e.clientY - rect.top;
      lastMoveRef.current = Date.now();
      globalOpacityRef.current = 1; // Réactive l'effet dès qu'il y a un mouvement
    };

    containerRef.current.addEventListener('mousemove', handleMouseMove);

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('mousemove', handleMouseMove);
        observer.disconnect();
      }
    };
  }, [containerRef, numCircles]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0, // placé derrière le contenu
      }}
    />
  );
};

export default CursorTrail;
