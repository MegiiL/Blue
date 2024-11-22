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

let createRect = (x, y, width, height, color) => {
    canvasContext.fillStyle = color;
    canvasContext.fillRect(x, y, width, height);
};


const DIRECTION_RIGHT = 4;
const DIRECTION_UP = 3;
const DIRECTION_LEFT = 2;
const DIRECTION_BOTTOM = 1;


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
    [1, 0, 1, 1, 1, 2, 1, 1, 1, 2, 2, 1, 1, 1, 2, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 2, 1, 2, 1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 0, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1],
    [1, 1, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 1, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

let gameLoop = () => {
    update();
    draw();
};

let update = () => {
    //todo 

   pacman.moveProcess();

}; 

let draw = () => {
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    createRect(0, 0, canvas.width, canvas.height, "black"); 
    drawWalls();

    pacman.draw();
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


  createNewPacman();
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

let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener("touchstart", (event) => {
    const touch = event.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
});

canvas.addEventListener("touchend", (event) => {
    const touch = event.changedTouches[0];
    const touchEndX = touch.clientX;
    const touchEndY = touch.clientY;

    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    // Determine swipe direction
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
            // Swipe Right
            pacman.nextDirection = DIRECTION_RIGHT;
        } else {
            // Swipe Left
            pacman.nextDirection = DIRECTION_LEFT;
        }
    } else {
        if (deltaY > 0) {
            // Swipe Down
            pacman.nextDirection = DIRECTION_BOTTOM;
        } else {
            // Swipe Up
            pacman.nextDirection = DIRECTION_UP;
        }
    }
});

