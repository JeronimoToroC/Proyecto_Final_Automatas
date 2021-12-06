const canvas = document.getElementById("canvas");
const canvas2 = document.getElementById("canvas2");
const canvas3 = document.getElementById("canvas3");
const ctx = canvas.getContext("2d");
const ctx2 = canvas2.getContext("2d");
const ctx3 = canvas3.getContext("2d");
const ruleLabel = document.getElementById("ruleNo");
const ruleSlider = document.getElementById("slider");
const instruments = []
const width = canvas.clientWidth;
const height = canvas.clientHeight;
const cellW = 4;

let ruleNo = 0;

function getSelectedArray() {
  const selectedValue = document.getElementById("list").value;
  instruments.push(selectedValue)
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

const draw = () => {
  for (let i = 0; i < cells.length; i++) {
    if (cells[i] == 1) {
      ctx.fillStyle = "green";
      ctx.fillRect(cellW * i, generation * cellW, cellW, cellW);

      ctx2.fillStyle = "black";
      ctx2.fillRect(cellW * i, generation * cellW, cellW, cellW);

      ctx3.fillStyle = "red";
      ctx3.fillRect(cellW * i, generation * cellW, cellW, cellW);
    } else {
      continue;
    }
  }
};

const run = () => {
  while (generation < height / cellW) {
    draw();
    generate();
  }
};

ruleSlider.oninput = ruleSlider.onkeydown = () => {
  if (ruleSlider.value > 255) {
    alert("Ingrese un valor entre 0 y 255")
    return
  } else {
    ruleNo = ruleSlider.value;
    ruleLabel.innerHTML = ruleNo;

    ruleSlider.onmouseup = onkeyup = () => {
      cells = initCells(new Array(Math.round(width / cellW)));
      ruleset = generateRulesetFromBinary(toBinary(ruleNo));
      generation = 0;
      suma = 0
      console.log("ruleNo", ruleNo);
      console.log("Jeronimo ", instruments)
      for (let i = 0; i < ruleset.length; i++) {
        suma += parseInt(ruleset[i])
      }
      if (suma > 0) {
        console.log("rulest", ruleset);
        for (let i = 0; i < ruleset.length; i++) {

        }
      }
      run();
    };
  }
};

ruleSlider.onmousedown = onkeydown = () => {
  ctx.clearRect(0, 0, width, height);
  ctx2.clearRect(0, 0, width, height);
  ctx3.clearRect(0, 0, width, height);
};
