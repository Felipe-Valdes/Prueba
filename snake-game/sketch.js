let snake;
let rez = 20;
let food;
let w;
let h;
let classifier;
const imageModelURL = 'https://teachablemachine.withgoogle.com/models/U7_ETARxw/';
let video;
let flippedVideo;
let label = "";
let labelCanvas;

function preload() {
  classifier = ml5.imageClassifier(imageModelURL + 'model.json');
}

function setup() {
  createCanvas(400, 400);

  video = createCapture(VIDEO);
  video.size(400, 400);
  flippedVideo = ml5.flipImage(video);
  flippedVideo.hide();
  classifyVideo();

  w = floor(width / rez);
  h = floor(height / rez);
  frameRate(5);
  snake = new Snake();
  foodLocation();

  // Crear un lienzo para mostrar el label
  labelCanvas = createGraphics(400, 50);
}

function draw() {
  // Dibujar el label en el canvas destinado a ello
  labelCanvas.background(0); // Fondo negro para el canvas del label
  labelCanvas.fill(255); // Color blanco para el texto del label
  labelCanvas.textSize(16);
  labelCanvas.textAlign(CENTER);
  labelCanvas.text(label, labelCanvas.width / 2, labelCanvas.height / 2);

  // Mostrar el canvas del label en el lienzo principal
  image(labelCanvas, 0, height - 50);

  scale(rez);
  background(220);
  if (snake.eat(food)) {
    foodLocation();
  }
  snake.update();
  snake.show();

  if (snake.endGame()) {
    print("END GAME");
    background(255, 0, 0);
    noLoop();
  }

  noStroke();
  fill(255, 0, 0);
  rect(food.x, food.y, 1, 1);
}

function foodLocation() {
  let x = floor(random(w));
  let y = floor(random(h));
  food = createVector(x, y);
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    snake.setDir(-1, 0);
  } else if (keyCode === RIGHT_ARROW) {
    snake.setDir(1, 0);
  } else if (keyCode === DOWN_ARROW) {
    snake.setDir(0, 1);
  } else if (keyCode === UP_ARROW) {
    snake.setDir(0, -1);
  } else if (key == ' ') {
    snake.grow();
  }
}

function classifyVideo() {
  flippedVideo = ml5.flipImage(video)
  classifier.classify(flippedVideo, gotResult);
}

function gotResult(error, results) {
  if (error) {
    console.error(error);
    return;
  }

  label = results[0].label;

  switch (label) {
    case "Arriba":
      snake.setDir(0, -1);
      break;
    case "Abajo":
      snake.setDir(0, 1);
      break;
    case "Izquierda":
      snake.setDir(-1, 0);
      break;
    case "Derecha":
      snake.setDir(1, 0);
      break;
    case "Neutro":
      // Do nothing or handle neutral case as needed
      break;
    default:
      // Handle other cases if necessary
      break;
  }

  classifyVideo();
}
