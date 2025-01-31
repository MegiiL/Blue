class Ghost {
    constructor(x, y, width, height, speed, imageX, imageY, imageWidth, imageHeight, range, id) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.imageX = imageX;
        this.imageY = imageY;
        this.imageWidth = imageWidth;
        this.imageHeight = imageHeight;
        this.range = range;
        this.initialX = x;
        this.initialY = y;
        this.direction = 'right'; // Default direction
        this.targetTile = this.getCurrentPosition();
        this.lastDirection = null; // Store last direction to avoid loops
    }

    getCurrentPosition() {
        return {
            row: Math.floor(this.y / oneBlockSize),
            col: Math.floor(this.x / oneBlockSize),
        };
    }

    getPossibleMoves() {
        let { row, col } = this.getCurrentPosition();
        let possibleMoves = [];

        if (col > 0 && map[row][col - 1] !== 1) possibleMoves.push("left");
        if (col < map[0].length - 1 && map[row][col + 1] !== 1) possibleMoves.push("right");
        if (row > 0 && map[row - 1][col] !== 1) possibleMoves.push("up");
        if (row < map.length - 1 && map[row + 1][col] !== 1) possibleMoves.push("down");

        return possibleMoves;
    }

    chooseDirection() {
        let possibleMoves = this.getPossibleMoves();

        if (possibleMoves.length > 1) {
            // Avoid backtracking (unless no other choice)
            const oppositeDirection = {
                left: "right",
                right: "left",
                up: "down",
                down: "up"
            };

            possibleMoves = possibleMoves.filter(dir => dir !== oppositeDirection[this.lastDirection]);

            // Add randomness: 20% chance to ignore backtracking rule for more natural movement
            if (Math.random() < 0.2 && this.lastDirection && possibleMoves.length > 1) {
                possibleMoves.push(oppositeDirection[this.lastDirection]);
            }
        }

        // Choose a new direction from the refined list
        if (possibleMoves.length > 0) {
            this.direction = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        }

        this.lastDirection = this.direction; // Update memory of last move

        // Set target tile for movement
        let { row, col } = this.getCurrentPosition();
        if (this.direction === "left") col--;
        else if (this.direction === "right") col++;
        else if (this.direction === "up") row--;
        else if (this.direction === "down") row++;

        this.targetTile = { row, col };
    }

    moveProcess() {
        let targetX = this.targetTile.col * oneBlockSize;
        let targetY = this.targetTile.row * oneBlockSize;

        // Move gradually
        if (this.x < targetX) this.x += this.speed;
        if (this.x > targetX) this.x -= this.speed;
        if (this.y < targetY) this.y += this.speed;
        if (this.y > targetY) this.y -= this.speed;

        // Check if the ghost reached its target tile
        if (Math.abs(this.x - targetX) < this.speed && Math.abs(this.y - targetY) < this.speed) {
            this.x = targetX;
            this.y = targetY;
            this.chooseDirection(); // Choose a new direction
        }
    }

    draw() {
        canvasContext.save();
    
        let scale = 1; // Default scale for pulsation effect
        let opacity = 1; // Default opacity for transparent effect
    
        //during the 8 seconds period start pulsation and opacity fluctuation
        if (ghostOverrideActive) {
            if (!this.pulsationStartTime) {
                this.pulsationStartTime = Date.now(); // Record the start time
            }
    
            // Calculate the elapsed time since pulsation started
            const elapsed = (Date.now() - this.pulsationStartTime) / 1000; // In seconds
    
            // Pulsation effect using sine wave
            scale = 1 + 0.2 * Math.sin(elapsed * 2 * Math.PI); // Scale oscillates between 1.0 and 1.2
    
            // Reduce opacity during pulsation
            opacity = 0.5 + 0.5 * Math.abs(Math.sin(elapsed * 2 * Math.PI)); // Opacity oscillates between 0.5 and 1.0
        } else {
            this.pulsationStartTime = null; // Reset when override is inactive
        }
    
        // Apply opacity to the context
        canvasContext.globalAlpha = opacity;
    
        // Adjust the ghost's position for scaling
        const offsetX = (oneBlockSize * (1 - scale)) / 2;
        const offsetY = (oneBlockSize * (1 - scale)) / 2;
    
        // Draw the ghost with pulsation scaling and reduced opacity
        canvasContext.drawImage(
            ghostFrames,
            this.imageX,  // Ghost position in PNG
            this.imageY,
            this.imageWidth, // Ghost width and height in PNG
            this.imageHeight,
            this.x + offsetX,             // Adjust position for scaling         
            this.y + offsetY,                      
            oneBlockSize * scale,         // Scale width       
            oneBlockSize * scale          // Scale height
        );
    
        canvasContext.restore();
    }
}
