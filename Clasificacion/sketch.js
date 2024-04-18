let extractorCaracteristicas;
let clasificador;
let video;
let pérdida;
let imágenesHusky = 0;
let imágenesGolden = 0;
let imágenesTerranova = 0;

function setup() {
  noCanvas();
  video = createCapture(VIDEO);
  video.parent("videoContainer");
  video.size(320, 240);

  extractorCaracteristicas = ml5.featureExtractor("MobileNet", modeloListo);

  const opciones = { numLabels: 3 };
  clasificador = extractorCaracteristicas.classification(video, opciones);
  configurarBotones();
}

function modeloListo() {
  clasificador.load("model/model.json", function () {
    select("#modelStatus").html("¡Modelo Personalizado Cargado!");
  });
}

function clasificar() {
  clasificador.classify(resultadosObtenidos);
}

function configurarBotones() {
  buttonPredict = select("#botonPredecir");
  buttonPredict.mousePressed(clasificar);
}
function resultadosObtenidos(err, resultados) {
  if (err) {
    console.error(err);
  }
  if (resultados && resultados[0]) {
    select("#resultado").html(resultados[0].label);
    select("#confianza").html(`${resultados[0].confidence.toFixed(2) * 100}%`);
    clasificar();
  }
}
