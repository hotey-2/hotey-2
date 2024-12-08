let highestZ = 1;

class Paper {
    holdingPaper = false;
    prevMouseX = 0;
    prevMouseY = 0;
    mouseX = 0;
    mouseY = 0;
    velocityX = 0;
    velocityY = 0;
    currentPaperX = 0;
    currentPaperY = 0;

    friction = 0.85; // Deceleration factor for smooth dragging
    maxVelocity = 15; // Limit the maximum speed of the paper movement

    init(paper) {
        // Dynamically set the background image from the data-image attribute
        const imageUrl = paper.getAttribute('data-image');
        paper.style.backgroundImage = `url('${imageUrl}')`; // Apply the background image for each paper

        // Handle mouse events for desktop
        const startDrag = (e) => {
            this.holdingPaper = true;
            paper.style.zIndex = highestZ; // Bring paper to the front
            highestZ += 1;

            if (e.type === 'mousedown') { // Left mouse button
                this.prevMouseX = this.mouseX;
                this.prevMouseY = this.mouseY;
            } else if (e.type === 'touchstart') { // Touch start on mobile
                this.prevMouseX = e.touches[0].clientX;
                this.prevMouseY = e.touches[0].clientY;
            }
        };

        // 'mousedown' event to start dragging for mouse
        paper.addEventListener('mousedown', startDrag);

        // 'touchstart' event to start dragging for mobile
        paper.addEventListener('touchstart', startDrag);

        // 'mousemove' event to drag the paper (now on window)
        const dragMove = (e) => {
            if (this.holdingPaper) {
                if (e.type === 'mousemove') {
                    this.mouseX = e.clientX;
                    this.mouseY = e.clientY;
                } else if (e.type === 'touchmove') {
                    this.mouseX = e.touches[0].clientX;
                    this.mouseY = e.touches[0].clientY;
                }

                // Calculate the velocity and move the paper smoothly
                this.velocityX = this.mouseX - this.prevMouseX;
                this.velocityY = this.mouseY - this.prevMouseY;

                this.currentPaperX += this.velocityX;
                this.currentPaperY += this.velocityY;

                // Apply friction to make the movement smoother
                this.velocityX *= this.friction;
                this.velocityY *= this.friction;

                // Prevent papers from moving too quickly (maximum speed)
                if (Math.abs(this.velocityX) < 0.1 && Math.abs(this.velocityY) < 0.1) {
                    this.velocityX = 0;
                    this.velocityY = 0;
                }

                // Apply the transformation to move the paper
                paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px)`;

                // Update previous mouse position
                this.prevMouseX = this.mouseX;
                this.prevMouseY = this.mouseY;
            }
        };

        // 'mousemove' event for desktop
        window.addEventListener('mousemove', dragMove);

        // 'touchmove' event for mobile
        window.addEventListener('touchmove', dragMove);

        // 'mouseup' event to stop dragging for desktop
        const stopDrag = () => {
            this.holdingPaper = false; // Stop dragging when mouse is released
        };

        // 'mouseup' event for desktop
        window.addEventListener('mouseup', stopDrag);

        // 'touchend' event to stop dragging for mobile
        window.addEventListener('touchend', stopDrag);
    }
}

// Select all the paper elements
const papers = Array.from(document.querySelectorAll('.paper'));

// Initialize each paper element with the Paper class
papers.forEach(paper => {
    const p = new Paper();
    p.init(paper);
});
