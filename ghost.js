class Ghost{
    constructor(x, y, width, height, speed, imageX, imageY, imageWidth, imageHeight, range){
        this.x = x; // x position
        this.y = y; // y position middle of map
        this.width = width; //ghost width in canvas
        this.height = height; //ghost height in canvas
        this.speed = speed;
        this.direction = DIRECTION_RIGHT;
        this.imageX = imageX; // ghost x position in PNG
        this.imageY = imageY; //ghost y position in PNG
        this.imageWidth = imageWidth; //ghost width in PNG
        this.imageHeight = imageHeight; //ghost height in PNG
        this.range = range;
        this.initialX = x; // Store initial position
        this.initialY = y; 
        this.pulsationStartTime = null; // Initialize to track pulsation timing
        this.randomTargetIndex = parseInt(Math.random() * randomTargetsForGhosts.length); //index for one of the ghosts random target array to keep moving
        
        setInterval(() =>{
            this.changeRandomDirection()
        }, 10000)
    }

    //change targets to keep moving if pacman is not near
   changeRandomDirection(){
    this.randomTargetIndex += 1;
    this.randomTargetIndex = this.randomTargetIndex % 8;
   }

   moveProcess(){
    // if pacman eats the power-up target second location of random targets array
    if (ghostOverrideActive) {
        this.target = randomTargetsForGhosts[1]; // Override target
    } else if (this.isInRangeOfPacman()) { //if pacman is near target pacman
        this.target = pacman;
    } else { //else target a random location from the array
        this.target = randomTargetsForGhosts[this.randomTargetIndex];
    }

    this.changeDirectionIfPossible();
    this.moveForwards();
    if (this.checkCollision()) {
        this.moveBackwards();
        return;
    }
}


   //moving backwards
   moveBackwards(){
        switch(this.direction){
            case DIRECTION_RIGHT:
                this.x -= this.speed;
                break;
            case DIRECTION_UP:
                this.y += this.speed;
                break;
            case DIRECTION_LEFT:
                this.x += this.speed;
                break;
            case DIRECTION_BOTTOM:
                this.y -= this.speed;
                break;

        }
      }

      //moving forwards
    moveForwards(){ 
        switch(this.direction){
            case DIRECTION_RIGHT:
                this.x += this.speed;
                break;
            case DIRECTION_UP:
                this.y -= this.speed;
                break;
            case DIRECTION_LEFT:
                this.x -= this.speed;
                break;
            case DIRECTION_BOTTOM:
                this.y += this.speed;
                break;

        }
     }

     //check wall collison so they don't move across the wall
    checkCollision(){ 
        let isCollided = false;
       
        if(map[this.getMapY()][this.getMapX()] == 1 ||
        map[this.getMapYRightSide()][this.getMapX()] == 1 ||
        map[this.getMapY()][this.getMapXRightSide()] == 1 ||
        map[this.getMapYRightSide()][this.getMapXRightSide()] == 1
    ){
        isCollided = true;
    }
    return isCollided;
    }

   
   //to calculate if pacman is near, make pacman target
    isInRangeOfPacman(){
        let xDistance = Math.abs(pacman.getMapX() - this.getMapX());
        let yDistance = Math.abs(pacman.getMapY() - this.getMapY());
        if(Math.sqrt(xDistance * xDistance + yDistance * yDistance) <= this.range){
          return true;  
        }
        return false;

    }

    changeDirectionIfPossible(){ 
        let tempDirection = this.direction;

        this.direction = this.calculateNewDirection(
            map,
            parseInt(this.target.x / oneBlockSize),
            parseInt(this.target.y / oneBlockSize)
        );

        if(typeof this.direction == "undefined"){
            this.direction = tempDirection;
            return;
        }
        
        this.moveForwards();
        if(this.checkCollision()){
            this.moveBackwards();
            this.direction = tempDirection;
        }else{
            this.moveBackwards();
        }

     }

     calculateNewDirection(map, destX, destY){
        let mp = [];
        for (let i = 0; i < map.length; i++) {
            mp[i] = map[i].slice(); // Clone the map
        }
    
        let queue = [{
            x: this.getMapX(),
            y: this.getMapY(),
            moves: [],
        }];
        
    
        while(queue.length > 0){
            let poped = queue.shift();
            if(poped.x == destX && poped.y == destY ){
                return poped.moves[0];
            }else{
                mp[poped.y][poped.x] = 1;
                let neigbourList = this.addNeigbours(poped, mp);
                for(let i = 0; i < neigbourList.length; i++){
                    queue.push(neigbourList[i]);
                }
    
            }
        }
    
       // return DIRECTION_BOTTOM; // Default direction if no path is found
    }
    


    addNeigbours(poped, mp){
        let queue = [];
        let numOfRows = mp.length;
        let numOfColumns = mp[0].length;
    
        // Check left direction
        if(poped.x - 1 >= 0 && mp[poped.y][poped.x - 1] != 1){ // left
            let tempMoves = poped.moves.slice();
            tempMoves.push(DIRECTION_LEFT);
            queue.push({x: poped.x - 1, y: poped.y, moves: tempMoves});
        }
    
        // Check right direction
        if(poped.x + 1 < numOfColumns && mp[poped.y][poped.x + 1] != 1){ // right
            let tempMoves = poped.moves.slice();
            tempMoves.push(DIRECTION_RIGHT);
            queue.push({x: poped.x + 1, y: poped.y, moves: tempMoves});
        }
    
        // Check up direction
        if(poped.y - 1 >= 0 && mp[poped.y - 1][poped.x] != 1){ // up
            let tempMoves = poped.moves.slice();
            tempMoves.push(DIRECTION_UP);
            queue.push({x: poped.x, y: poped.y - 1, moves: tempMoves});
        }
    
        // Check down direction
        if(poped.y + 1 < numOfRows && mp[poped.y + 1][poped.x] != 1){ // down
            let tempMoves = poped.moves.slice();
            tempMoves.push(DIRECTION_BOTTOM);
            queue.push({x: poped.x, y: poped.y + 1, moves: tempMoves});
        }
    
        return queue;
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
    


    getMapX(){
        return parseInt(this.x / oneBlockSize);
    }

    getMapY(){
        return parseInt(this.y / oneBlockSize);
    }

    getMapXRightSide(){
        return parseInt((this.x + 0.9999 * oneBlockSize)/ oneBlockSize);
    }

    getMapYRightSide(){
        return parseInt((this.y + 0.9999 * oneBlockSize)/ oneBlockSize);
    }
} 
