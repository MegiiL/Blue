const canvas = document.getElementById("canvas");
const canvasContext = canvas.getContext("2d");
const pacmanFrames = document.getElementById("animations");
const ghostFrames = document.getElementById("ghosts");

// Global variables to store canvas dimensions and block size
let canvasWidth, canvasHeight, oneBlockSize;
// Maximum canvas width constraint
const maxCanvasWidth = 600;

let wallColor = "#342DCA";
let fps = 30;
let wallSpaceWidth;
let wallOffset;
let wallInnerColor = "black";
let foodColor = "#ffff4d";
let score = 0;
let ghosts = [];
let ghostCount = 4;
let lives = 3;
let foodCount = 0;

let createRect = (x, y, width, height, color) => {
    canvasContext.fillStyle = color;
    canvasContext.fillRect(x, y, width, height);
};


const DIRECTION_RIGHT = 4;
const DIRECTION_UP = 3;
const DIRECTION_LEFT = 2;
const DIRECTION_BOTTOM = 1;

let ghostImageLocations = [
    {x: 0, y: 0},
    {x: 176, y:0},
    {x: 0, y: 121},
    {x: 176, y:121},
]

// if 1- wall, if 0 not wall
// Map definition (20 columns × 22 rows)
let map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 1, 2, 1, 2, 2, 2, 2, 2, 2, 1, 2, 1, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 1, 2, 2, 2, 2, 2, 2, 1, 2, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1],
    [1, 2, 2, 2, 1, 2, 1, 2, 2, 2, 2, 2, 2, 1, 2, 1, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1],
    [1, 1, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 1, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

for(let i =0; i < map.length; i++){
    for(let j = 0; j < map[0].length; j++){
       if(map[i][j] == 2){
         foodCount++;
       }
    }
}

let randomTargetsForGhosts = [
    {x: 1 * oneBlockSize, y: 1 * oneBlockSize},
    {x: 1 * oneBlockSize, y: (map.length - 2) * oneBlockSize},
    {x: (map[0].length - 2) * oneBlockSize, y: oneBlockSize },
    {x: (map[0].length - 2) * oneBlockSize, y: (map.length - 2) * oneBlockSize},

];

let gameLoop = () => {
    draw();
    update();
};



let update = () => {
   pacman.moveProcess();
   pacman.eat();
   for(let i = 0; i < ghosts.length; i++){
    ghosts[i].moveProcess();
   }

   if(pacman.checkGhostCollision(ghosts)){
    restartGame();
   }

   if(score >= foodCount){
    drawWin();
    clearInterval(gameInterval);
   }

   
}; 

let restartGame = () => {
    createNewPacman();
    createGhosts();
    lives--;
    if(lives == 0){
        gameOver();
    }

};

let gameOver = () => {
    drawGameOver();
    clearInterval(gameInterval);
};

let drawGameOver = () => {
    canvasContext.font = "20px Emulogic";
    canvasContext.fillStyle = "white";
    canvasContext.fillText("Game Over", 200, 200);
};

let drawWin = () => {
    canvasContext.font = "20px Emulogic";
    canvasContext.fillStyle = "white";
    canvasContext.fillText("Winner", 150, 200);
};

let drawFoods = () => {
    for(let i =0; i < map.length; i++){
        for(let j = 0; j < map[0].length; j++){
           if(map[i][j] == 2){
            createRect(j * oneBlockSize + oneBlockSize / 3,
                i * oneBlockSize + oneBlockSize / 3,
                oneBlockSize / 3,
                oneBlockSize / 3,
                foodColor
             );
           }
        }
    }
}

// Draw heart shape
function drawHeart(x, y, size, color) {
    canvasContext.fillStyle = color;
    canvasContext.beginPath();
    canvasContext.moveTo(x, y);
    canvasContext.bezierCurveTo(x - size / 2, y - size / 2, x - size / 2, y + size / 2, x, y + size / 2);
    canvasContext.bezierCurveTo(x + size / 2, y + size / 2, x + size / 2, y - size / 2, x, y);
    canvasContext.closePath();
    canvasContext.fill();
}


let drawLives = () => {
    const startX = canvas.width - (3* oneBlockSize);
    const startY = oneBlockSize/2 - wallOffset;
    let heartSize;

    if (canvas.width <= 200) {
        heartSize = 8; // Smaller for screens up to 200px
        for (let i = 0; i < lives; i++) {
            drawHeart(startX + i * 10, startY, heartSize, "red");
        }
    }else if (canvas.width <= 400) {
        heartSize = 16; // Small for screens up to 400px
        for (let i = 0; i < lives; i++) {
            drawHeart(startX + i * 16, startY, heartSize, "red");
        }
    }else if (canvas.width <= 600) {
        heartSize = 18; // Medium for screens between 401px and 600px
        for (let i = 0; i < lives; i++) {
            drawHeart(startX + i * 22, startY, heartSize, "red");
        }
    }

    
};


let drawScore = () => {

canvasContext.fillStyle="white";
if (canvas.width <= 200) {
    canvasContext.font = "10px Courier"; }// Smaller font for screens up to 400px
else if (canvas.width <= 400) {
    canvasContext.font = "16px Courier"; // Smaller font for screens up to 400px
} else if (canvas.width <= 600) {
    canvasContext.font = "18px Courier"; // Medium font for screens between 401px and 600px
}

canvasContext.fillText("Score: " + score, oneBlockSize , oneBlockSize/2 + 4.5); // position of score at top left of the screen
}


let drawGhosts = () => {
    for(let i = 0; i < ghosts.length; i++){
        ghosts[i].draw();
    }

}

let draw = () => {
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    createRect(0, 0, canvas.width, canvas.height, "black"); 
    drawWalls();
    drawFoods();
    pacman.draw();
    drawScore();
    drawGhosts();
    drawLives();
};

let gameInterval = setInterval(gameLoop, 1000 / fps);

let drawWalls = () => {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
            if (map[i][j] == 1) {
                createRect(
                    j * oneBlockSize,
                    i * oneBlockSize,
                    oneBlockSize,
                    oneBlockSize,
                    wallColor
                );

                if( j > 0 && map[i][j -1] == 1){
                    createRect(j * oneBlockSize, i * oneBlockSize + wallOffset,
                        wallSpaceWidth + wallOffset,
                        wallSpaceWidth,
                        wallInnerColor,
                    );
                }
                if(j < map[0].length - 1 && map[i][j+1] == 1){
                    createRect(j * oneBlockSize + wallOffset, i * oneBlockSize + wallOffset,
                        wallSpaceWidth + wallOffset,
                        wallSpaceWidth,
                        wallInnerColor,
                    );
                }
                
                if( i > 0 && map[i - 1][j] == 1){
                    createRect(j * oneBlockSize + wallOffset, i * oneBlockSize,
                        wallSpaceWidth,
                        wallSpaceWidth + wallOffset,
                        wallInnerColor,
                    );
                }
                if(i < map.length - 1 && map[i + 1][j] == 1){
                    createRect(j * oneBlockSize + wallOffset, i * oneBlockSize + wallOffset,
                        wallSpaceWidth ,
                        wallSpaceWidth + wallOffset,
                        wallInnerColor,
                    );
                }
            }
        }
    }
};


let createNewPacman = () => {
    pacman = new Pacman(
      oneBlockSize,
      oneBlockSize,
      oneBlockSize,
      oneBlockSize,
      oneBlockSize / 5
  
     );
  };
  


// Function to calculate canvas size
let calculateCanvasSize = () => {
    const screenWidth = window.innerWidth;

    if (screenWidth < maxCanvasWidth) {
        canvasWidth = Math.floor(screenWidth / 20) * 20;
    } else {
        canvasWidth = maxCanvasWidth;
    }

    oneBlockSize = canvasWidth / 20;
    canvasHeight = oneBlockSize * 22;

    // Calculate wall-related properties after oneBlockSize is determined
    wallSpaceWidth = oneBlockSize / 1.5;
    wallOffset = (oneBlockSize - wallSpaceWidth) / 2;

    // Set canvas dimensions
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
};

// Initialize the canvas size on load
calculateCanvasSize();



// Add an event listener to recalculate canvas size when the window is resized
window.addEventListener("resize", calculateCanvasSize);


  let createGhosts = () => {
   ghosts = [];
   for(let i = 0; i < ghostCount; i++){
    let newGhost = new Ghost(
        9 *  oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize,  // draw it at 10th column , can remove the condition?
        10 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize,  // draw it at 11th row
        oneBlockSize, // take one block size width
        oneBlockSize, // take one block size height
        (oneBlockSize/5) /2, // ghost speed
        ghostImageLocations[i % 4].x, // x image location
        ghostImageLocations[i % 4].y, // y image location
        124, // ghost width
        116, // ghost height
        6 + i // range

    );
    ghosts.push(newGhost);
   }
  }
  createNewPacman();
  createGhosts();
  gameLoop(); 


  window.addEventListener("keydown", (event) =>{
    let k = event.keyCode;

    setTimeout(() =>{
        if(k == 37 || k == 65){ //left
            pacman.nextDirection = DIRECTION_LEFT;

        }else if(k == 38 || k == 87) { //up
            pacman.nextDirection = DIRECTION_UP;

        }else if(k == 39 || k == 68){ //right
            pacman.nextDirection = DIRECTION_RIGHT;

        }else if(k == 40 || k == 83){ //bottom
            pacman.nextDirection = DIRECTION_BOTTOM;

        }
     
    }, 1)
  } )
