const canvas = document.getElementById("canvas");
const canvasContext = canvas.getContext("2d");
const pacmanFrames = document.getElementById("animations"); //7 pacman frames to look like he is biting
const ghostFrames = document.getElementById("ghosts"); // 4 ghosts

// Global variables to store canvas dimensions and block size
let canvasWidth, canvasHeight, oneBlockSize;
// Maximum canvas width constraint
const maxCanvasWidth = 600;
let wallSpaceWidth;
let wallOffset;

let wallColor = "#342DCA"; // blue wall
let fps = 30; //number of frames to draw per second
let wallInnerColor = "black"; //making blocks black in the middle
let foodColor = "#ffff4d"; // yellow food
let score = 0;  //user score
let ghosts = []; //ghosts array
let randomTargetsForGhosts = []; // random targets for ghosts array
let ghostCount = 4; 
let lives = 3; // 3 tries for user within the game
let foodCount = 0; //useful to calculate total winning score
let powerUpCount = 0; //userful to calculate total winning score


// wall, food 
let createRect = (x, y, width, height, color) => {
    canvasContext.fillStyle = color;
    canvasContext.fillRect(x, y, width, height);
};

//moving directions
const DIRECTION_RIGHT = 4;
const DIRECTION_UP = 3;
const DIRECTION_LEFT = 2;
const DIRECTION_BOTTOM = 1;

//ghosts positions on the png image
let ghostImageLocations = [
    {x: 0, y: 0},
    {x: 176, y:0},
    {x: 0, y: 121},
    {x: 176, y:121},
]

// if 1- wall
// if 2- food = 230 total
// if 4- cherry power-up = 4 total
// when pacman eats food/power-up tile = 3, empty tile
// Map definition (20 columns × 22 rows)
let map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 1, 2, 1, 2, 2, 2, 2, 2, 2, 1, 2, 1, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 1, 2, 2, 2, 2, 2, 2, 1, 2, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 4, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1],
    [1, 2, 2, 2, 1, 2, 1, 2, 2, 2, 2, 2, 2, 1, 2, 1, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1],
    [1, 1, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 1, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

// Count how many foods to calculate total winning score, one food is worth one point
//if tile = 2 it is food
for(let i =0; i < map.length; i++){        
    for(let j = 0; j < map[0].length; j++){
       if(map[i][j] == 2){
         foodCount++;
       }
    }
}

// Count how many power-ups to calculate total winning score, one power-up is worth ten points
//if tile = 4 it is power-up
for(let i =0; i < map.length; i++){
    for(let j = 0; j < map[0].length; j++){
       if(map[i][j] == 4){
         powerUpCount++;
       }
    }
}

//gameloop to draw and update the elements
let gameLoop = () => {
    draw();
    update();
};


//game logic
let update = () => {
    pacman.moveProcess();
    pacman.eat();
    pacman.eatPowerUp();
    for(let i = 0; i < ghosts.length; i++){
     ghosts[i].moveProcess();
    }
 
    if(pacman.checkGhostCollision(ghosts)){ //if pacman and ghosts collide restart the game
     restartGame();
    }
 
    if(score >= (foodCount + 10 * powerUpCount)){ // user needs 270 points to win (230 food times 1 points each + 4 power-ups times 10 points each)
     drawWin();
     clearInterval(gameInterval);
    }
 
    
 }; 
 
//when pacman and ghosts collide they are drawn to the initial positions
// user loses one live/heart
// if there are no more lives/hearts left GAME OVER
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

//in each tile equal to 2, draw food for pacman
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

//in each tile equal to 4 draw a cherry power-up
let drawPowerUp = () => {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
            if (map[i][j] == 4) {
                let x = j * oneBlockSize + oneBlockSize / 2; // Center x
                let y = i * oneBlockSize + oneBlockSize / 2; // Center y
                let radius = oneBlockSize / 6;              // Radius of the cherry circles
                
                // Draw cherry
                canvasContext.beginPath();
                canvasContext.arc(x - radius, y, radius, 0, Math.PI * 2); // Left cherry
                canvasContext.arc(x + radius, y, radius, 0, Math.PI * 2); // Right cherry
                canvasContext.fillStyle = "red";
                canvasContext.fill();

                // Draw stem
                canvasContext.beginPath();
                canvasContext.moveTo(x - radius, y);                  // Left cherry stem start
                canvasContext.lineTo(x, y - radius * 2);              // Stem apex
                canvasContext.lineTo(x + radius, y);                  // Right cherry stem end
                canvasContext.strokeStyle = "green";
                canvasContext.lineWidth = 2;
                canvasContext.stroke();
            }
        }
    }
};



// Draw heart shape representing lives
function drawHeart(x, y, size, color) {
    canvasContext.fillStyle = color;
    canvasContext.beginPath();
    canvasContext.moveTo(x, y);
    canvasContext.bezierCurveTo(x - size / 2, y - size / 2, x - size / 2, y + size / 2, x, y + size / 2);
    canvasContext.bezierCurveTo(x + size / 2, y + size / 2, x + size / 2, y - size / 2, x, y);
    canvasContext.closePath();
    canvasContext.fill();
}

// draw hearts at the top right side of screen
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

//draw score at the top left side of the screen
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

//draw ghosts
let drawGhosts = () => {
    for(let i = 0; i < ghosts.length; i++){
        ghosts[i].draw();
    }

}

//draw the game elements: wall, food, power-up, pacman, ghosts, score, lives
let draw = () => {
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    createRect(0, 0, canvas.width, canvas.height, "black"); 
    drawWalls();
    drawFoods();
    drawPowerUp();
    pacman.draw();
    drawScore();
    drawGhosts();
    drawLives();
};

let gameInterval = setInterval(gameLoop, 1000 / fps);

// draw wall with blue borders and black within
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

// pacman properties
let createNewPacman = () => {
    pacman = new Pacman(
      oneBlockSize, // x position second row
      oneBlockSize, // y position second column
      oneBlockSize, // pacman width
      oneBlockSize, // pacman height
      oneBlockSize / 5 //pacman speed
  
     );
  };
  


// Function to calculate canvas size
let calculateCanvasSize = () => {
    const screenWidth = window.innerWidth;

    if (screenWidth < maxCanvasWidth) {  //if screen is smaller than 600px, find the biggest number up to screenwidth which divided by 20 is 0 , set it as canvas width
        canvasWidth = Math.floor(screenWidth / 20) * 20;
    } else {
        canvasWidth = maxCanvasWidth; //else if screen is bigger than 600px or equal to it, set it as canvas width
    }

    oneBlockSize = canvasWidth / 20; //one block will be canvas width divided by 20 columns
    canvasHeight = oneBlockSize * 22; // canvas height will be one block time 22 rows

    // Calculate wall-related properties after oneBlockSize is determined
    wallSpaceWidth = oneBlockSize / 1.5;
    wallOffset = (oneBlockSize - wallSpaceWidth) / 2;

    // Set canvas dimensions
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    // set random targets across the map if pacman is not in range, ghosts will move to these tiles
    randomTargetsForGhosts = [
        {x: 1 * oneBlockSize, y: 1 * oneBlockSize},
        {x: 1 * oneBlockSize, y: (map.length - 2) * oneBlockSize},
        {x: (map[0].length - 2) * oneBlockSize, y: oneBlockSize },
        {x: (map[0].length - 2) * oneBlockSize, y: (map.length - 2) * oneBlockSize},
        //{x: 9 * oneBlockSize, y: 10 * oneBlockSize},
        {x: 1 * oneBlockSize, y: 20 * oneBlockSize},
        {x: 12 * oneBlockSize, y: 20 * oneBlockSize},
        {x: 9 * oneBlockSize, y: 20 * oneBlockSize},
        {x:  5 * oneBlockSize, y: 20 * oneBlockSize},
    ];
};

// Initialize the canvas size on load
calculateCanvasSize();



// Add an event listener to recalculate canvas size when the window is resized
window.addEventListener("resize", calculateCanvasSize);

// ghosts properties
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
