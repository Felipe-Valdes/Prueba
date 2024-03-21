// Variables globales para la serpiente, resolución de la cuadrícula, comida, y dimensiones de la cuadrícula.
let snake;
let rez = 20; // Factor de resolución para escalar todo el juego.
let food;
let w; // Ancho del campo de juego en "unidades" de juego, no en píxeles.
let h; // Altura del campo de juego en "unidades" de juego, no en píxeles.
let classifier;

// Model URL
const imageModelURL = 'https://teachablemachine.withgoogle.com/models/U7_ETARxw/';

// Video
let video;
let flippedVideo;

// Load the model first
function preload() {
  classifier = ml5.imageClassifier(imageModelURL + 'model.json');
}

// Función de configuración inicial para p5.js, se llama una vez al inicio.
function setup() {
  createCanvas(800, 400); // Crea un lienzo de 800x400 píxeles.
  let videoCanvas = createGraphics(400, 400); // Crea un lienzo para el video de la cámara
  let gameCanvas = createGraphics(400, 400); // Crea un lienzo para el juego de la serpiente

  w = floor(width / rez); // Calcula el ancho del campo de juego en unidades de juego.
  h = floor(height / rez); // Calcula la altura del campo de juego en unidades de juego.

  snake = new Snake(); // Crea una nueva instancia de la serpiente.
  foodLocation(); // Coloca la comida en una ubicación inicial aleatoria.

  // Inicializar la cámara y clasificar el video
  video = createCapture(VIDEO);
  video.size(400, 400); // Establecer el tamaño del video
  video.hide(); // Ocultar el elemento de video
  flippedVideo = ml5.flipImage(video);

  classifyVideo(); // Comienza a clasificar el video
}

// Genera una nueva ubicación para la comida en el campo de juego.
function foodLocation() {
  let x = floor(random(w)); // Posición aleatoria en el eje X.
  let y = floor(random(h)); // Posición aleatoria en el eje Y.
  food = createVector(x, y); // Crea un vector para la posición de la comida.
}

// Get a prediction for the current video frame
function classifyVideo() {
  flippedVideo = ml5.flipImage(video);
  classifier.classify(flippedVideo, gotResult);
}

// When we get a result
function gotResult(error, results) {
  // If there is an error
  if (error) {
    console.error(error);
    return;
  }
  // The results are in an array ordered by confidence.
  // console.log(results[0]);
  let label = results[0].label;

  // Cambia la dirección de la serpiente basándose en la clasificación obtenida.
  if (label === "Up") {
    snake.setDir(0, -1); // Mueve hacia arriba.
  } else if (label === "Down") {
    snake.setDir(0, 1); // Mueve hacia abajo.
  } else if (label === "Left") {
    snake.setDir(-1, 0); // Mueve hacia la izquierda.
  } else if (label === "Right") {
    snake.setDir(1, 0); // Mueve hacia la derecha.
  }

  // Classify again!
  classifyVideo();
}

// Función de dibujo que p5.js llama en bucle para animar el juego.
function draw() {
  background(220); // Establece el color de fondo del lienzo.

  // Dibujar el video de la cámara en su propio lienzo
  image(flippedVideo, 0, 0, 400, 400);

  // Dibujar el juego de la serpiente en su propio lienzo
  snake.update(); // Actualiza la posición de la serpiente.
  snake.show(); // Dibuja la serpiente en el lienzo.

  // Comprueba si el juego ha terminado (la serpiente choca consigo misma o con el borde).
  if (snake.endGame()) {
    print("END GAME"); // Imprime un mensaje en la consola.
    background(255, 0, 0); // Cambia el color de fondo a rojo para indicar el fin del juego.
    noLoop(); // Detiene el bucle de dibujo, finalizando el juego.
  }

  // Dibujar la comida en el campo de juego.
  noStroke(); // No dibuja bordes para la comida.
  fill(255, 0, 0); // Establece el color de la comida a rojo.
  rect(food.x * rez, food.y * rez, rez, rez); // Dibuja la comida como un cuadrado.
}