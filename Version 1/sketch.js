// Video

let video;
let classifier;
let label;
let confidence;

let modelo = 'https://teachablemachine.withgoogle.com/models/we_cLM3AA/'

// Step 1 : Load the model


function preload() {
  // Create a camera input
  video = createCapture(VIDEO, {
    video: {
      width: 280,
      height: 280,
      aspectRatio: 1
    }
  });
  // Load the DoodleNet Image Classification model
  classifier = ml5.imageClassifier(modelo, video);
}

function setup() {
  // Create a 'label' and 'confidence' div to hold results
  label = createDiv('Label: ...');
  confidence = createDiv('Confidence: ...');

  classifyVideo();
}

// Get a prediction for the current video frame
function classifyVideo() {
  classifier.classify(gotResult);
}

// A function to run when we get any errors and the results
function gotResult(error, results) {
  // Display error in the console
  if (error) {
    console.error(error);
  }
  // The results are in an array ordered by confidence.
  console.log(results);
  // Show the first label and confidence
  label.html(`Label: ${results[0].label}`);

  if (results[0].confidence > 0.999) {
    confidence.style('color', 'green');
  } else {
    confidence.style('color', 'red');
  }

  if (results[0].confidence > 0.999) {
    confidence.html(`Confidence: ${nf(results[0].confidence, 0, 2)}⭐`);
  } else {
    confidence.html(`Confidence: ${nf(results[0].confidence, 0, 2)}`);
  }

  // Call classifyVideo again
  classifyVideo();
}