const allInstruments = ["trompeta","guitarra","piano","bajo","tambor","pandereta","violin","tuba","saxo","electrica"];
const canvas = document.getElementById("canvas");
const canvas2 = document.getElementById("canvas2");
const canvas3 = document.getElementById("canvas3");
const ctx = canvas.getContext("2d");
const ctx2 = canvas2.getContext("2d");
const ctx3 = canvas3.getContext("2d");
const ruleLabel = document.getElementById("ruleNo");
const ruleSlider = document.getElementById("slider");
const width = canvas.clientWidth;
const height = canvas.clientHeight;
const cellW = 4;

let instruments = [];
let ruleNo = 0;

window.addEventListener("DOMContentLoaded", function() {
  const insturmentsSelect = document.getElementById("list");

  allInstruments.forEach(instrument => {
    insturmentsSelect.add(new Option(instrument, instrument));
  });
}, false);

function getSelectedArray() {
  const selectedValue = document.getElementById("list").value;

  if (instruments.length >= 3) {
    alert("Solo puedes seleccionar 3 instrumentos.")
    return;
  }

  instruments.push(selectedValue);
  document.getElementById("selectedInstruments").innerHTML = String(instruments)
}

const toBinary = (no) => {
  return ("00000000" + (no >>> 0).toString(2)).slice(-8);
};

const generateRulesetFromBinary = (binary) => {
  let ruleset = [];
  for (let n of binary) {
    ruleset.push(n);
  }
  return ruleset;
};

const initCells = (cells) => {
  for (let i = 0; i < cells.length; i++) {
    cells[i] = 0;
  }

  cells[cells.length / 2] = 1;
  return cells;
};

const rules = (a, b, c, ruleset) => {
  const s = "" + a + b + c;
  const index = parseInt(s, 2);

  return ruleset[index];
};

let cells = initCells(new Array(Math.round(width / cellW)));
let ruleset = generateRulesetFromBinary(toBinary(ruleNo));
let generation = 0;

const generate = () => {
  const newGen = [];

  for (let i = 0; i < cells.length; i++) {
    const left = i == 0 ? cells[cells.length - 1] : cells[i - 1];
    const me = cells[i];
    const right = i == cells.length - 1 ? cells[0] : cells[i + 1];
    newGen[i] = parseInt(rules(left, me, right, ruleset));
  }
  cells = newGen;
  generation++;
};

let colours = {
  "canvas1": ["green", "chartreuse"],
  "canvas2": ["gold", "maroon"],
  "canvas3": ["red", "violet"],
};

const draw = (rulesetPos) => {
  for (let i = 0; i < cells.length; i++) {
    if (cells[i] == 1) {
      ctx.fillStyle = colours.canvas1[rulesetPos];
      ctx.fillRect(cellW * i, generation * cellW, cellW, cellW);

      ctx2.fillStyle = colours.canvas2[rulesetPos];
      ctx2.fillRect(cellW * i, generation * cellW, cellW, cellW);

      ctx3.fillStyle = colours.canvas3[rulesetPos];
      ctx3.fillRect(cellW * i, generation * cellW, cellW, cellW);
    } else {
      continue;
    }
  }
};

const run = (ruleset) => {
  let i = 0;

  while (generation < height / cellW) {
    draw(ruleset[i]);
    generate();

    if ((generation % 12.5) == 0) {
      i++;
    }
  }
};

function play() {
  if (ruleSlider.value > 255) {
    alert("Ingrese un valor entre 0 y 255")
    return
  }

  ruleNo = ruleSlider.value;
  ruleLabel.innerHTML = ruleNo;

  cells = initCells(new Array(Math.round(width / cellW)));
  ruleset = generateRulesetFromBinary(toBinary(ruleNo));
  generation = 0;
  suma = 0
  console.log("ruleNo", ruleNo);
  console.log("Jeronimo ", instruments)
  for (let i = 0; i < ruleset.length; i++) {
    suma += parseInt(ruleset[i])
  }

  if (suma <= 0) {
    return;
  }

  drawRuleset(ruleset);

  for (let j = 0; j < ruleset.length; j++) {
    for (let i = 0; i < instruments.length; i++) {
      const instrument = instruments[i];
      const version = parseInt(ruleset[j]) + 1;
      playSound(instrument, version);
    }
  }

  run(ruleset);
};

async function playSound(instrument, version) {
  instrument = String(instrument).toLowerCase();
  version = String(version);

  var audio = new Audio('./sonidos/'+instrument+version+'.mp3');

  return audio.play();
}

ruleSlider.onmousedown = onkeydown = () => {
  ctx.clearRect(0, 0, width, height);
  ctx2.clearRect(0, 0, width, height);
  ctx3.clearRect(0, 0, width, height);
};


function drawRuleset(ruleset) {
  document.getElementById("ruleset").innerHTML = ruleset;
}

function getRandom (list) {
  return list[Math.floor((Math.random()*list.length))];
}

function setSelectedInstruments(list) {
  instruments = list;
  document.getElementById("selectedInstruments").innerHTML = String(instruments)
}

function selectInstrumentsRandom() {
  let tempInstruments = Array(getRandom(allInstruments));
  tempInstruments.push(getRandom(allInstruments))
  tempInstruments.push(getRandom(allInstruments))

  tempInstruments = tempInstruments.slice(0, 3);

  setSelectedInstruments(tempInstruments);
}