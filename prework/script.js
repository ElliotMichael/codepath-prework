//global constants
const clueHoldTime = 1000; //represents how long each clue's light/sound is held
const cluePauseTime = 333; //how long to pause between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence

//Global Variables
var pattern = [2, 2, 4, 3, 2, 1, 2, 4]; //keeps track of the secret pattern of the button presses
var progress = 0; //indicates how far along the player is in guessing the pattern
var gamePlaying = false; //natural state of the game before it begins
var tonePlaying = false;
var volume = 0.5; //volume must be between 0.0 to 1.0
var guessCounter = 0; //keeps track of where the user is in the clue sequence

function startGame() {
  //initialize game variables
  progress = 0;
  gamePlaying = true;

  //this part is responsible for swapping the Start and Stop buttons
  //to enable each appear individually.
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  playClueSequence();
}

function stopGame() {
  gamePlaying = false;
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
}

// Sound Synthesis Functions
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2,
};
function playTone(btn, len) {
  o.frequency.value = freqMap[btn];
  g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
  context.resume();
  tonePlaying = true;
  setTimeout(function () {
    stopTone();
  }, len);
}
function startTone(btn) {
  if (!tonePlaying) {
    context.resume();
    o.frequency.value = freqMap[btn];
    g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
    context.resume();
    tonePlaying = true;
  }
}
function stopTone() {
  g.gain.setTargetAtTime(0, context.currentTime + 0.05, 0.025);
  tonePlaying = false;
}

// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
var o = context.createOscillator();
var g = context.createGain();
g.connect(context.destination);
g.gain.setValueAtTime(0, context.currentTime);
o.connect(g);
o.start(0);

//these functions are responsible for the button lighting when the computer
//plays clues from the pattern for the user to repeat.

function lightButton(btn) {
  document.getElementById("button" + btn).classList.add("lit");
}

function clearButton(btn) {
  document.getElementById("button" + btn).classList.remove("lit");
}

function playSingleClue(btn) {
  if (gamePlaying) {
    lightButton(btn);
    playTone(btn, clueHoldTime);
    setTimeout(clearButton, clueHoldTime, btn);
    //setTimeout is a built-in javaScript function for scheduling
    //code to call at some point in the future.
  }
}

function playClueSequence() {
  guessCounter = 0; //
  let delay = nextClueWaitTime; //set delay to initial wait time
  for (let i = 0; i <= progress; i++) {
    // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms");
    setTimeout(playSingleClue, delay, pattern[i]); // set a timeout to play that clue
    delay += clueHoldTime; 
    delay += cluePauseTime;
  }
}

function loseGame() {
  stopGame();
  alert("Game over. you lost.");
}

function winGame() {
  stopGame();
  alert("Game over. You won!");
}

function guess(btn) {
  console.log("user guessed: " + btn);
  if (!gamePlaying) {
    return;
  }
  if (pattern[guessCounter] == btn) {
    //is guess correct?
    if (guessCounter == progress) {
      //tells when turn is over.
      if (progress == pattern.lenght - 1) {
        //tells if this is the last turn.
        winGame(); //game is won provided guess is correct, turn is over and it's the last turn.
      } else {
        progress++; //progress is incremented if it's not last turn.
        playClueSequence(); //next play sequence is played.
      }
    } else {
      guessCounter++; //checks the next guess
    }
  } else {
    loseGame(); // lose game fuction runs when guess is incorrect. therefore, Game Over.
  }
}
