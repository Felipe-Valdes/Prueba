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
  select("#modelStatus").html("MobileNet Loaded!");
}

function clasificar() {
  clasificador.classify(resultadosObtenidos);
}

function configurarBotones() {
  buttonA = select("#goldenButton");
  buttonA.mousePressed(function () {
    clasificador.addImage("Golden");
    select("#amountOfGoldenImages").html((imágenesGolden += 1));
  });

  buttonB = select("#huskyButton");
  buttonB.mousePressed(function () {
    clasificador.addImage("Husky");
    select("#amountOfHuskyImages").html((imágenesHusky += 1));
  });

  buttonC = select("#terranovaButton");
  buttonC.mousePressed(function () {
    clasificador.addImage("Terranova");
    select("#amountOfTerranovaImages").html((imágenesTerranova += 1));
  });

  train = select("#entrenar");
  train.mousePressed(function () {
    clasificador.train(function (valorPérdida) {
      if (valorPérdida) {
        pérdida = valorPérdida;
        select("#pérdida").html(`Pérdida: ${pérdida}`);
      } else {
        select("#pérdida").html(`¡Entrenamiento Completo! Pérdida Final: ${pérdida}`);
      }
    });
  });

  buttonPredict = select("#botonPredecir");
  buttonPredict.mousePressed(clasificar);

  saveBtn = select("#guardar");
  saveBtn.mousePressed(function () {
    clasificador.save();
  });
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
