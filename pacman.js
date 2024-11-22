class Pacman{
    constructor(x, y, width, height, speed){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.direction = 4;
        this.currentFrame = 1;
        this.frameCount = 7;

        setInterval(() => {
            this.changeAnimation();
        }, 100);
    }


    moveProcess(){
        this.changeDirectionIfPossible();
        this.moveForwards();
        if(this.checkCollision()){
            this.moveBackwards();
            return;
        }

     }

    eat(){ }

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

    checkGhostCollision(){  }

    changeDirectionIfPossible(){  }

    changeAnimation(){
        this.currentFrame = this.currentFrame == this.frameCount ? 1 : this.currentFrame + 1;
      }

    draw(){
        canvasContext.save();
        canvasContext.translate(
            this.x + oneBlockSize / 2,
            this.y + oneBlockSize / 2
        );

        canvasContext.rotate( (this.direction * 90 * Math.PI) / 180);

        canvasContext.translate(
            - this.x - oneBlockSize / 2,
            - this.y - oneBlockSize / 2
        );

        
    // Draw the current animation frame, scaling to oneBlockSize
    canvasContext.drawImage(
        pacmanFrames,
        (this.currentFrame - 1) * 20, // Source x (20px per frame)
        0,                           // Source y
        20,                          // Source width (frame width in the sprite sheet)
        20,                          // Source height (frame height in the sprite sheet)
        this.x,                      // Destination x
        this.y,                      // Destination y
        oneBlockSize,                // Scale to oneBlockSize (30px)
        oneBlockSize                 // Scale to oneBlockSize (30px)
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
