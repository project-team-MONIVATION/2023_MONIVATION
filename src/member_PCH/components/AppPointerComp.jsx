import React, { useState, useEffect } from 'react';

export default function AppPointerComp() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      // console.log(e.clientX);
    }
    
    window.addEventListener('mousemove', handleMouseMove);
    
  }, []);

  return (
    <div
      className="pointer"
      style={{ left: position.x, top: position.y }}
    ></div>
  );
}