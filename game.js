//GHOSTS DONT MOVE PROPERLY PROBLEM


const canvas = document.getElementById("canvas");
const canvasContext = canvas.getContext("2d");
const pacmanFrames = document.getElementById("animations"); //7 pacman frames to look like he is biting
const ghostFrames = document.getElementById("ghosts"); // 4 ghosts


// Global variables to store canvas dimensions and block size
let canvasWidth, canvasHeight, oneBlockSize;
// Maximum canvas width constraint
const maxCanvasWidth = 600;
const maxCanvasHeight = 660; // 22 rows * 30px per block as a default
//Variables to mofidy the wall setting and create blocks
let wallSpaceWidth;
let wallOffset;

let wallColor = "#342DCA"; // blue wall
let fps = 30; //number of frames to draw per second
let wallInnerColor = "black"; //making blocks black in the middle
let foodColor = "#ffff4d"; // yellow food
let score = 0;  //user score
let ghosts = []; //ghosts array
let randomTargetsForGhosts = []; // random targets for ghosts array
let ghostCount = 4; // number of ghosts
let lives = 3; // 3 tries for user within the game
let foodCount = 0; //useful to calculate user score and winning condition
let powerUpCount = 0; //userful to calculate user score and winning condition

//Variables useful during the power-up 
let ghostOverrideActive = false;
let ghostOverrideTimer = null;

let gameStarted = false;  // Flag to control when the game starts
let paused = false;  // Flag to control the paused state
// Pause button
const pauseButton = document.getElementById('pauseButton');

let gameResult;


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
// if 2- food 
// if 4- cherry power-up = 4 total
// when pacman eats food/power-up tile = 3, empty tile
// if 5 - ghost space
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
    [1, 2, 2, 4, 1, 2, 1, 2, 2, 2, 2, 2, 2, 1, 2, 1, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 1, 2, 2, 2, 2, 2, 2, 1, 2, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 1, 5, 5, 1, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 5, 5, 1, 2, 1, 2, 1, 1, 1, 1, 1],
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

// Count how many foods to calculate user score
//if tile = 2 it is food
for(let i =0; i < map.length; i++){        
    for(let j = 0; j < map[0].length; j++){
       if(map[i][j] == 2){
         foodCount++;
       }
    }
}

// Count how many power-ups to calculate user score
//if tile = 4 it is power-up
for(let i =0; i < map.length; i++){
    for(let j = 0; j < map[0].length; j++){
       if(map[i][j] == 4){
         powerUpCount++;
       }
    }
}



// Show the game over screen
function showGameOverScreen(gameResult) {
    //pause game when game finishes
    gameStarted = false;
    // score holds the user's score
    const resultMessage = document.getElementById('resultMessage');

    if(gameResult == true){ //Win
        resultMessage.innerHTML = `Winner!<br>Your score: ${score}`;  // show the total score
    }else { 
        resultMessage.innerHTML = `Try again!<br>Your score: ${score}`;   // Lose and show the total score
    }
    
    document.getElementById('gameOverScreen').style.display = 'flex';  // Show the game over screen
}

// Start the game loop when "Play" button is clicked
document.getElementById('playButton').addEventListener('click', function() {
    document.getElementById('welcomeScreen').style.display = 'none'; //welcome screen dissapears
    pauseButton.style.display = 'block'; // Show the pause button

    gameStarted = true;
    paused = false;  // Ensure the game is not paused initially
   
});

// Replay the game when the "Replay" button is clicked
document.getElementById('replayButton').addEventListener('click', function() {
    document.getElementById('gameOverScreen').style.display = 'none';
    replayGame(); //reset all changed elements and recreate pacman/ghosts
   
});

// Pause Button Event Listener
pauseButton.addEventListener('click', function() {
    
    paused = !paused;  // Toggle pause state
    
    if (paused) {
        pauseButton.textContent = '▷';  // Change button text to 'Resume'
    } else {
        pauseButton.textContent = '||';  // Change button text to 'Pause'
    }
});



//gameloop to draw and update the elements
let gameLoop = () => {
    if(gameStarted && !paused){
    draw();
    update();
    }
};


//game logic
let update = () => {
    //if play/replay button is clicked and game is not paused continue with the logic
    pacman.moveProcess();
    pacman.eat();
    pacman.eatPowerUp();

    ghosts.forEach(ghost => ghost.moveProcess());

    // Handle collision logic
    if (pacman.checkGhostCollision(ghosts)) { //if pacman and ghost collide
        if (ghostOverrideActive) { // during the 8 seconds of eating the power-up
            ghosts.forEach(ghost => {
                if (pacman.getMapX() === ghost.getMapX() && pacman.getMapY() === ghost.getMapY()) {
                    // Draw the ghost at its initial position as pacman eats the ghost
                    ghost.x = ghost.initialX;
                    ghost.y = ghost.initialY;
                    score+=20; // increase user score by 20 points for ghost eaten
                }
            });
        } else {
            restartGame(); //lose one heart/life 
        }
    }
      // Check for win condition
      if (foodCount == 0 && powerUpCount == 0) { //if pacman eats all foods and power-ups WIN
        gameResult = true; //win
        console.log(foodCount);
        console.log(powerUpCount);
        console.log('win');
        showGameOverScreen(gameResult);
    }

};

//Reset map, score, lives since they change during the game
//Set gameStarted to initial values to continue playing
//Create pacman and ghosts to their initial positions
//Continue with gameLoop to draw/move all elements 
let replayGame = () => {
    map = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 1],
        [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
        [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
        [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
        [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
        [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
        [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
        [1, 2, 2, 4, 1, 2, 1, 2, 2, 2, 2, 2, 2, 1, 2, 1, 2, 2, 2, 1],
        [1, 1, 1, 1, 1, 2, 1, 2, 2, 2, 2, 2, 2, 1, 2, 1, 1, 1, 1, 1],
        [1, 2, 2, 2, 2, 2, 2, 2, 1, 5, 5, 1, 2, 2, 2, 2, 2, 2, 2, 1],
        [1, 1, 1, 1, 1, 2, 1, 2, 1, 5, 5, 1, 2, 1, 2, 1, 1, 1, 1, 1],
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
    score = 0;
    lives = 3;
    foodCount = 0;
    for(let i =0; i < map.length; i++){        
        for(let j = 0; j < map[0].length; j++){
           if(map[i][j] == 2){
             foodCount++;
           }
        }
    }
    
    powerUpCount= 0;
    for(let i =0; i < map.length; i++){
        for(let j = 0; j < map[0].length; j++){
           if(map[i][j] == 4){
             powerUpCount++;
           }
        }
    }
    createNewPacman();
    createGhosts();
    gameStarted = true;
    paused = false;
    gameLoop();

};

 
//under normal circumstances: when pacman and ghosts collide they are drawn to the initial positions
// user loses one live/heart
// if there are no more lives/hearts left GAME OVER
let restartGame = () => {
    createNewPacman();
    createGhosts();
    lives--;
    if(lives == 0){
        console.log(foodCount);
        console.log(powerUpCount);
        console.log('lose');
        gameResult = false; //lose
        showGameOverScreen(gameResult);
    }

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
    const startX = 9.5 * oneBlockSize;
    const startY = oneBlockSize/2 - wallOffset;
   // const startX = canvas.width - (3* oneBlockSize);
   // const startY = oneBlockSize/2 - wallOffset;
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
    canvasContext.font = "7px Courier"; }// Smaller font for screens up to 200px
else if (canvas.width <= 400) {
    canvasContext.font = "15px Courier"; // Smaller font for screens up to 400px
} else if (canvas.width <= 600) {
    canvasContext.font = "17px Courier"; // Medium font for screens between 401px and 600px
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
    //console.log(foodCount);
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
      oneBlockSize, // x position 
      oneBlockSize, // y position 
      oneBlockSize, // pacman width
      oneBlockSize, // pacman height
      oneBlockSize / 5 //pacman speed
  
     );
  };
  


// Function to calculate canvas size
let calculateCanvasSize = () => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    if (screenWidth < maxCanvasWidth) {  //if screen is smaller than 600px, find the biggest number up to screenwidth which divided by 20 is 0 , set it as canvas width
        canvasWidth = Math.floor(screenWidth / 20) * 20;
    } else {
        canvasWidth = maxCanvasWidth; //else if screen is bigger than 600px or equal to it, set canvas width as 600px
    }

    oneBlockSize = canvasWidth / 20; //one block will be canvas width divided by 20 columns
    canvasHeight = oneBlockSize * 22; // canvas height will be one block time 22 rows

    // Adjust canvas height if it exceeds screen height
    if (canvasHeight > screenHeight) {
    canvasHeight = Math.floor(screenHeight / 22) * 22; 
    oneBlockSize = canvasHeight / 22; 
    canvasWidth = oneBlockSize * 20; 
    }

    // Calculate wall-related properties after oneBlockSize is determined
    wallSpaceWidth = oneBlockSize / 1.5;
    wallOffset = (oneBlockSize - wallSpaceWidth) / 2;

    // Set canvas dimensions
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    //canvas at the center point of the screen
    canvas.style.position = 'absolute';
    canvas.style.left = '50%';
    canvas.style.top = '50%';
    canvas.style.transform = 'translate(-50%, -50%)';


    pauseButton.style.top = `${canvas.height - ( 21.75 * oneBlockSize)}px`; // Vertical position
    pauseButton.style.left = `${canvas.width - (1.75 * oneBlockSize) }px`; // Horizontal position


    
    if (canvas.width <= 200) {
        pauseButton.style.width = "5px"; // Button width
        pauseButton.style.height = "5px"; // Button height
        pauseButton.style.fontSize = "1px"; // Smaller font for screens up to 200px
    } else if (canvas.width <= 400) {
        pauseButton.style.width = "10px"; // Button width
        pauseButton.style.height = "10px"; // Button height
        pauseButton.style.fontSize = "5px"; // Smaller font for screens up to 400px
    } else if (canvas.width <= 600) {
        pauseButton.style.width = "17px"; // Button width
        pauseButton.style.height = "17px"; // Button height
        pauseButton.style.fontSize = "10px"; // Medium font for screens between 401px and 600px
    }
  
    
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
        9 *  oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize,  // draw it at 10th column 
        10 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize,  // draw it at 11th row
        oneBlockSize, // take one block size width
        oneBlockSize, // take one block size height
        (oneBlockSize/5) /2, // ghost speed
        ghostImageLocations[i % 4].x, // x image location
        ghostImageLocations[i % 4].y, // y image location
        124, // ghost width in png
        116, // ghost height in png
        6 + i // range

    );
    ghosts.push(newGhost); //add to ghost array
   }
  }
  createNewPacman();
  createGhosts();
  gameLoop(); 

// Prevent text selection and context menu on long press
canvas.addEventListener("touchstart", (event) => {
    event.preventDefault(); // Prevent long press triggering selection
});

canvas.addEventListener("contextmenu", (event) => {
    event.preventDefault(); // Prevent context menu on long press
});

// pacman movement on desktop using A/D W/S or arrow keys
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

// Variables to store the start position of a swipe
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

// Detect the start of a touch
canvas.addEventListener("touchstart", (event) => {
    const touch = event.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
});

// Detect the end of a touch
canvas.addEventListener("touchend", () => {
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    // Determine swipe direction based on the largest movement
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > 0) {
            pacman.nextDirection = DIRECTION_RIGHT; // Swipe right
        } else {
            pacman.nextDirection = DIRECTION_LEFT; // Swipe left
        }
    } else {
        // Vertical swipe
        if (deltaY > 0) {
            pacman.nextDirection = DIRECTION_BOTTOM; // Swipe down
        } else {
            pacman.nextDirection = DIRECTION_UP; // Swipe up
        }
    }
});

// Detect the movement of a touch
canvas.addEventListener("touchmove", (event) => {
    const touch = event.touches[0];
    touchEndX = touch.clientX;
    touchEndY = touch.clientY;
});
