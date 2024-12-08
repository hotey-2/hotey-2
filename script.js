

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

        // 'mousedown' event to start dragging
        paper.addEventListener('mousedown', (e) => {
            this.holdingPaper = true;
            paper.style.zIndex = highestZ; // Bring paper to the front
            highestZ += 1;

            if (e.button === 0) { // Left mouse button
                this.prevMouseX = e.clientX; // Store the initial mouse position
                this.prevMouseY = e.clientY;
            }
        });

        // 'mousemove' event to drag the paper (now on window)
        window.addEventListener('mousemove', (e) => {
            if (this.holdingPaper) {
                // Get current mouse position
                this.mouseX = e.clientX;
                this.mouseY = e.clientY;

                // Calculate the movement of the mouse
                this.velocityX = this.mouseX - this.prevMouseX;
                this.velocityY = this.mouseY - this.prevMouseY;

                // Update current paper position
                this.currentPaperX += this.velocityX;
                this.currentPaperY += this.velocityY;

                // Apply friction to make the movement smoother (slow down the paper)
                this.velocityX *= this.friction;
                this.velocityY *= this.friction;

                // Apply velocity limit to prevent the paper from moving too fast
                if (Math.abs(this.velocityX) > this.maxVelocity) {
                    this.velocityX = this.maxVelocity * Math.sign(this.velocityX);
                }
                if (Math.abs(this.velocityY) > this.maxVelocity) {
                    this.velocityY = this.maxVelocity * Math.sign(this.velocityY);
                }

                // Apply the transformation to move the paper
                paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px)`;

                // Update previous mouse position for next movement
                this.prevMouseX = this.mouseX;
                this.prevMouseY = this.mouseY;
            }
        });

        // 'mouseup' event to stop dragging
        window.addEventListener('mouseup', () => {
            this.holdingPaper = false; // Stop dragging when mouse is released
            console.log('Mouse button is released');
        });
    }
}

// Select all the paper elements
const papers = Array.from(document.querySelectorAll('.paper'));

// Initialize each paper element with the Paper class
papers.forEach(paper => {
    const p = new Paper();
    p.init(paper);
});