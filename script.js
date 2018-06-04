//access canvas
const canvas = document.getElementById('my-canvas');

//set canvas context for 2d rendering
const ctx = canvas.getContext('2d');

//ball position
let x = canvas.width / 2
let y = canvas.height - 30

//ball speed
let dx = 2
let dy = -2

//score stuff
let score = 0;

//lives
let lives = 3

//ball radius
let ballRadius = 10;

//default for event listeners for pressing left or right
let rightPressed = false;
let leftPressed = false;

//paddle stuff
let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width-paddleWidth)/2

//brick stuff
let brickRowCount = 3;
let brickColumnCount = 5;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;
let bricks = [];
for (let c = 0 ; c < brickColumnCount ; c ++) {
  bricks[c] = []
  for(let r = 0; r < brickRowCount ; r++){
    bricks[c][r] = {x: 0, y: 0, status: 1}
  }
}

//event listeners
const keyDownHandler = (e) =>{
  if (e.keyCode === 39){
    rightPressed = true;
  } else if (e.keyCode === 37){
    leftPressed = true;
  }
}

const keyUpHandler = (e) => {
  if (e.keyCode === 39){
    rightPressed = false
  } else if (e.keyCode === 37) {
    leftPressed = false
  }
}

//draw the paddle
const drawPaddle = () => {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

//draw the ball
const drawBall = () => {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

//draw bricks
const drawBricks = () => {
  for(let c = 0 ; c < brickColumnCount ; c++) {
    for(let r = 0; r < brickRowCount ; r++) {
      if (bricks[c][r].status === 1){
        let brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
        let brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

//draw the score
const drawScore = () =>{
  ctx.font = '16px Arial';
  ctx.fillStyle = "#0095DD";
  ctx.fillText(`Score: ${score}`, 8, 20)
}

//lives
const drawLives = () =>{
  ctx.font = '16px Arial';
  ctx.fillStyle = '#0095DD';
  ctx.fillText(`Lives: ${lives}`, canvas.width-65, 20)
}

//collision detection
const collisionDetection = () => {
  for (let c = 0 ; c < brickColumnCount ; c++){
    for (let r = 0 ; r < brickRowCount ; r++){
      let b = bricks[c][r];
      if (b.status === 1){
        if (x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight){
          dy = -dy
          b.status = 0
          score++
          if (score === brickColumnCount * brickRowCount){
            alert('YOU WIN!')
            document.location.reload();
          }
        }
      }
    }
  }
}

//game state
const draw = () =>{
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawBricks();
  drawBall();
  drawPaddle();
  collisionDetection();
  drawScore();
  drawLives();
  //check to see if the current position of the ball and the offset due to speed equal out to the side edges of the canvas
  if (x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
    //if they do, send the ball in the opposite direction
    dx = -dx
  }
  //check to see if the current position of the ball and the offset due to speed equal out to the top edge of the window or the bottom of the canvas
  if (y + dy < ballRadius){
    //if they do, send the ball in the opposite direction
    dy = -dy
  } else if (y + dy > canvas.height-ballRadius){
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy
    } else {
      lives --;
      if (!lives){
        //why is this alerting twice?!
        alert('GAME OVER!')
        document.location.reload();
      } else {
      x = canvas.width/2;
      y = canvas.height-30;
      dx = 2;
      dy = -2;
      paddleX = (canvas.width-paddleWidth)/2;
      }
    }
  }

  if(rightPressed && paddleX < canvas.width-paddleWidth) {
    paddleX += 7;
  } else if(leftPressed && paddleX > 0) {
    paddleX -= 7;
  }
x += dx
y += dy
requestAnimationFrame(draw)
}
draw();

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
