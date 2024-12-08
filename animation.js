document.addEventListener('DOMContentLoaded', () => {
    const glucoseContainer = document.getElementById('glucose-animation');
    if (glucoseContainer) {
        new GlucoseAnimation(glucoseContainer);
    }
});

class GlucoseAnimation {
    constructor(container) {
        this.svg = document.getElementById('glucose-graph');
        this.avatarsGroup = document.getElementById('avatars');
        
        if (!this.svg || !this.avatarsGroup) {
            console.warn('Required elements not found for glucose animation');
            return;
        }

        this.width = window.innerWidth;
        this.height = 250;
        
        // Update SVG attributes
        this.svg.setAttribute('width', this.width);
        this.svg.setAttribute('height', this.height);
        
        // Add resize listener
        window.addEventListener('resize', () => {
            this.width = window.innerWidth;
            this.svg.setAttribute('width', this.width);
        });
        
        // Adjust the lines to be closer together
        const baseHeight = this.height / 2;
        const spacing = 55; // Even tighter spacing
        
        this.lines = [
            { id: 'line1', amplitude: 20, frequency: 0.1, speed: 0.001, phase: 0, baseY: baseHeight - spacing * 1.5 },
            { id: 'line2', amplitude: 20, frequency: 0.15, speed: 0.0015, phase: Math.PI / 3, baseY: baseHeight - spacing * 0.75 },
            { id: 'line3', amplitude: 20, frequency: 0.12, speed: 0.001, phase: Math.PI / 2, baseY: baseHeight },
            { id: 'line4', amplitude: 20, frequency: 0.08, speed: 0.0012, phase: Math.PI / 4, baseY: baseHeight + spacing * 0.75 },
            { id: 'line5', amplitude: 20, frequency: 0.11, speed: 0.0014, phase: Math.PI / 6, baseY: baseHeight + spacing * 1.5 }
        ];
        
        this.isHovered = false;
        
        this.avatars = [
            { id: 1, img: 'https://randomuser.me/api/portraits/women/32.jpg', lineId: 'line1', offset: 0.75, delay: 0 },
            { id: 2, img: 'https://randomuser.me/api/portraits/men/45.jpg', lineId: 'line2', offset: 0.25, delay: 200 },
            { id: 3, img: 'https://randomuser.me/api/portraits/women/68.jpg', lineId: 'line3', offset: 0.65, delay: 400 },
            { id: 4, img: 'https://randomuser.me/api/portraits/men/22.jpg', lineId: 'line4', offset: 0.35, delay: 600 },
            { id: 5, img: 'https://randomuser.me/api/portraits/women/45.jpg', lineId: 'line5', offset: 0.55, delay: 800 }
        ];
        
        this.init();
    }

    initialize() {
        // Only set attributes if container exists
        if (this.container) {
            this.container.setAttribute('width', '100%');
            this.container.setAttribute('height', '100%');
            // ... rest of initialization code ...
        }
    }

    createGlucosePath(line) {
        const points = Math.floor(this.width / 10);
        const segments = [];
        const stabilityFactor = this.isHovered ? 0.3 : 1;
        
        for (let i = 0; i <= points; i++) {
            const x = (i / points) * this.width;
            const y = line.baseY + 
                     Math.sin(i * line.frequency + (Date.now() * line.speed) + line.phase) * 
                     line.amplitude * stabilityFactor;
            
            segments.push(`${i === 0 ? 'M' : 'L'} ${x} ${y}`);
        }
        
        return segments.join(' ');
    }

    createAvatar(avatar) {
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.classList.add('avatar');
        group.setAttribute('id', `avatar-${avatar.id}`);
        group.style.pointerEvents = 'none'; // Ensure no pointer events
        
        // Set initial opacity to 0 for fade-in effect
        group.style.opacity = '0';

        // Create glow effect
        const glow = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        glow.setAttribute('r', '35');
        glow.classList.add('avatar-glow');

        // Create avatar circle
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('r', '25');
        circle.classList.add('avatar-circle');

        // Create avatar image
        const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
        image.setAttribute('x', '-25');
        image.setAttribute('y', '-25');
        image.setAttribute('width', '50');
        image.setAttribute('height', '50');
        image.setAttribute('href', avatar.img);
        image.setAttribute('clip-path', 'circle(25px at center)');

        group.appendChild(glow);
        group.appendChild(circle);
        group.appendChild(image);
        this.avatarsGroup.appendChild(group);

        // Fade in the avatar with custom delay
        setTimeout(() => {
            group.style.transition = 'opacity 1s ease';
            group.style.opacity = '1';
        }, avatar.delay); // Use custom delay for each avatar

        return group;
    }

    updateAvatarPositions() {
        this.avatars.forEach(avatar => {
            const avatarElement = document.getElementById(`avatar-${avatar.id}`);
            const line = document.getElementById(avatar.lineId);
            
            if (!avatarElement || !line) return;
            
            const pathLength = line.getTotalLength();
            const point = line.getPointAtLength(pathLength * avatar.offset);
            avatarElement.setAttribute('transform', `translate(${point.x}, ${point.y})`);
        });
    }

    animate() {
        // Update each glucose line
        this.lines.forEach(line => {
            const pathElement = document.getElementById(line.id);
            if (pathElement) {
                pathElement.setAttribute('d', this.createGlucosePath(line));
            }
        });
        
        // Update avatar positions
        this.updateAvatarPositions();
        
        // Continue animation
        requestAnimationFrame(() => this.animate());
    }

    init() {
        // Create multiple glucose lines
        this.lines.forEach((line, index) => {
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('id', line.id);
            path.classList.add('glucose-path');
            path.style.opacity = `${1 - (index * 0.1)}`; // Make each line slightly more transparent
            this.svg.insertBefore(path, this.avatarsGroup);
        });

        // Create avatars
        this.avatars.forEach(avatar => this.createAvatar(avatar));
        
        // Start animation
        this.animate();

        // Add interactivity to the entire graph area
        this.svg.addEventListener('mouseenter', () => {
            this.isHovered = true;
            document.querySelectorAll('.glucose-path').forEach(path => {
                path.style.filter = 'drop-shadow(0 0 25px rgba(255, 215, 0, 0.8)) drop-shadow(0 0 15px rgba(255, 215, 0, 0.5))';
                path.style.strokeWidth = '4';
            });
        });

        this.svg.addEventListener('mouseleave', () => {
            this.isHovered = false;
            document.querySelectorAll('.glucose-path').forEach(path => {
                path.style.filter = 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.3))';
                path.style.strokeWidth = '3';
            });
        });

        // Add individual line hover effects
        this.lines.forEach(line => {
            const path = document.getElementById(line.id);
            if (path) {
                path.addEventListener('mouseenter', () => {
                    path.style.filter = 'drop-shadow(0 0 35px rgba(255, 215, 0, 0.9)) drop-shadow(0 0 25px rgba(255, 215, 0, 0.7))';
                    path.style.strokeWidth = '6';
                });
                
                path.addEventListener('mouseleave', () => {
                    if (this.isHovered) {
                        path.style.filter = 'drop-shadow(0 0 25px rgba(255, 215, 0, 0.8)) drop-shadow(0 0 15px rgba(255, 215, 0, 0.5))';
                        path.style.strokeWidth = '4';
                    } else {
                        path.style.filter = 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.3))';
                        path.style.strokeWidth = '3';
                    }
                });
            }
        });
    }
}

