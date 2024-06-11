import React, {useEffect, useRef} from 'react'

export default function CanvasBg(props) {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (canvasRef.current) {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d");
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
    
          const particles = [];
          const speed = 0.5;
          const texts = [
            "function",
            "var",
            "let",
            "const",
            "if",
            "else",
            "for",
            "while",
            "return",
            "class",
          ]; // Texts for particles
    
          const numParticles = adjustDensity();
    
          // Particle class
          class Particle {
            constructor(x_dir, y_dir) {
              this.x_init = Math.random() * canvas.width;
              this.y_init = Math.random() * canvas.height;
              this.x = this.x_init;
              this.y = this.y_init;
              this.speed = {
                x: x_dir * (Math.random() * speed),
                y: y_dir * (Math.random() * speed),
              };
              this.text = texts[Math.floor(Math.random() * texts.length)];
              this.opacity = 0.1 + Math.random() * 0.6;
              this.color = `rgba(${Math.random() * 255},${Math.random() * 255},${
                Math.random() * 255
              },${this.opacity})`;
              this.size = Math.random() * 3 + 1; // Varying size of particles
            }
    
            move() {
              this.x += this.speed.x * 2;
              this.y += this.speed.y * 2;
    
              // Adjust particle position if it goes beyond canvas boundaries
              if (this.x < 0 || this.x > canvas.width) {
                this.speed.x *= -1;
              }
              if (this.y < 0 || this.y > canvas.height) {
                this.speed.y *= -1;
              }
            }
    
            draw() {
              ctx.fillStyle = this.color;
              ctx.font = `${this.size * 10}px Arial`; // Adjust font size based on particle size
              ctx.globalAlpha = this.opacity;
              ctx.fillText(this.text, this.x, this.y);
            }
          }
    
          // Initialize particles
          for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle(1, 1));
            particles.push(new Particle(-1, 1));
            particles.push(new Particle(1, -1));
            particles.push(new Particle(-1, -1));
          }
    
          function adjustDensity() {
            const viewportWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
            const viewportHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
            const numParticles = Math.floor((viewportWidth * viewportHeight) / 20000); // Adjust this factor for desired density
            
            return numParticles;
          }
    
          // Animation loop
          function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
    
            particles.forEach((particle) => {
              particle.move();
              particle.draw();
            });
          }
    
          // Start animation
          animate();
        }
      }, [canvasRef.current, window.innerWidth]);

        
    return <canvas ref={canvasRef} style={props.style}></canvas>
}
