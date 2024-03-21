// Variables globales para la serpiente, resolución de la cuadrícula, comida, y dimensiones de la cuadrícula.
let snake;
let rez = 20; // Factor de resolución para escalar todo el juego.
let food;
let w; // Ancho del campo de juego en "unidades" de juego, no en píxeles.
let h; // Altura del campo de juego en "unidades" de juego, no en píxeles.
let classifier;
const imageModelURL = 'https://teachablemachine.withgoogle.com/models/U7_ETARxw/';
let video;
let flippedVideo;
let label = "";

function preload() {
  // eslint-disable-next-line prefer-template
  classifier = ml5.imageClassifier(imageModelURL + 'model.json');
}


let canvasSnake; // Lienzo para el juego de la serpiente
let canvasCamera; // Lienzo para la cámara y el label

// Función de configuración inicial para p5.js, se llama una vez al inicio.
function setup() {
  // Crea un lienzo para el juego de la serpiente
  canvasSnake = createCanvas(400, 400); // Crea un lienzo de 400x400 píxeles.
  canvasSnake.position(0, 0); // Posiciona el lienzo del juego en la esquina superior izquierda

  // Crea un lienzo para la cámara y el label
  canvasCamera = createCanvas(400, 400); // Crea un lienzo de 400x400 píxeles.
  canvasCamera.position(400, 0); // Posiciona el lienzo de la cámara a la derecha del lienzo del juego

  // Configuración de la cámara
  video = createCapture(VIDEO); // Captura de video desde la cámara
  video.size(400, 400); // Tamaño del video
  video.hide(); // Oculta el elemento de video para que no se muestre directamente en la página

  // Inicia la clasificación de video
  classifyVideo();

  // Configuración del juego de la serpiente
  w = floor(width / rez); // Calcula el ancho del campo de juego en unidades de juego.
  h = floor(height / rez); // Calcula la altura del campo de juego en unidades de juego.
  frameRate(5); // Establece la velocidad del juego a 5 cuadros por segundo.
  snake = new Snake(); // Crea una nueva instancia de la serpiente.
  foodLocation(); // Coloca la comida en una ubicación inicial aleatoria.
}


// Función de dibujo que p5.js llama en bucle para animar el juego.
function draw() {
  scale(rez); // Escala todo el dibujo por el factor de resolución.
  background(220); // Establece el color de fondo del lienzo.
  if (snake.eat(food)) {
    foodLocation(); // Si la serpiente come la comida, genera una nueva ubicación para la comida.
  }
  snake.update(); // Actualiza la posición de la serpiente.
  snake.show(); // Dibuja la serpiente en el lienzo.

  // Comprueba si el juego ha terminado (la serpiente choca consigo misma o con el borde).
  if (snake.endGame()) {
    print("END GAME"); // Imprime un mensaje en la consola.
    background(255, 0, 0); // Cambia el color de fondo a rojo para indicar el fin del juego.
    noLoop(); // Detiene el bucle de dibujo, finalizando el juego.
  }

  // Dibuja la comida en el campo de juego.
  noStroke(); // No dibuja bordes para la comida.
  fill(255, 0, 0); // Establece el color de la comida a rojo.
  rect(food.x, food.y, 1, 1); // Dibuja la comida como un cuadrado.
}


// Genera una nueva ubicación para la comida en el campo de juego.
function foodLocation() {
  let x = floor(random(w)); // Posición aleatoria en el eje X.
  let y = floor(random(h)); // Posición aleatoria en el eje Y.
  food = createVector(x, y); // Crea un vector para la posición de la comida.
}

// Función que se llama cada vez que se presiona una tecla.
function keyPressed() {
  // Cambia la dirección de la serpiente basándose en la tecla presionada.
  if (keyCode === LEFT_ARROW) {
    snake.setDir(-1, 0); // Mueve hacia la izquierda.
  } else if (keyCode === RIGHT_ARROW) {
    snake.setDir(1, 0); // Mueve hacia la derecha.
  } else if (keyCode === DOWN_ARROW) {
    snake.setDir(0, 1); // Mueve hacia abajo.
  } else if (keyCode === UP_ARROW) {
    snake.setDir(0, -1); // Mueve hacia arriba.
  } else if (key == ' ') {
    snake.grow(); // Hace crecer la serpiente al presionar la barra espaciadora.
  }
}

// Get a prediction for the current video frame
function classifyVideo() {
  flippedVideo = ml5.flipImage(video)
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
  label = results[0].label;

  // Move the snake based on the classification result
  switch (label) {
    case "Arriba":
      snake.setDir(0, -1); // Move up
      break;
    case "Abajo":
      snake.setDir(0, 1); // Move down
      break;
    case "Izquierda":
      snake.setDir(-1, 0); // Move left
      break;
    case "Derecha":
      snake.setDir(1, 0); // Move right
      break;
    case "Neutro":
      // Do nothing or handle neutral case as needed
      break;
    default:
      // Handle other cases if necessary
      break;
  }

  // Classify again!
  classifyVideo();
}


