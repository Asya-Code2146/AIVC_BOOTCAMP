const currentEl = document.getElementById("current");
const prevEl = document.getElementById("prev");

let current = "0";
let previous = "";
let operator = null;
let waitingForOperand = false;

function updateDisplay() {
  currentEl.textContent = current;
  prevEl.textContent = previous + (operator ? " " + operator : "");
}

function inputNumber(num) {
  if (waitingForOperand) {
    current = num;
    waitingForOperand = false;
  } else {
    current = current === "0" ? num : current + num;
  }
  updateDisplay();
}

function inputDecimal() {
  if (waitingForOperand) {
    current = "0.";
    waitingForOperand = false;
    updateDisplay();
    return;
  }
  if (!current.includes(".")) {
    current += ".";
    updateDisplay();
  }
}

function chooseOperator(op) {
  if (operator && !waitingForOperand) {
    compute();
  }
  previous = current;
  operator = op;
  waitingForOperand = true;
  updateDisplay();
}

function compute() {
  const prev = parseFloat(previous);
  const curr = parseFloat(current);
  if (isNaN(prev) || isNaN(curr)) return;

  let result;
  switch (operator) {
    case "+":
      result = prev + curr;
      break;
    case "-":
      result = prev - curr;
      break;
    case "*":
      result = prev * curr;
      break;
    case "/":
      result = curr === 0 ? "Error" : prev / curr;
      break;
    default:
      return;
  }

  current = result.toString();
  operator = null;
  previous = "";
  waitingForOperand = true;
}

function calculatePercent() {
  const curr = parseFloat(current);
  if (isNaN(curr)) return;
  current = (curr / 100).toString();
  waitingForOperand = true;
  updateDisplay();
}

function clearAll() {
  current = "0";
  previous = "";
  operator = null;
  waitingForOperand = false;
  updateDisplay();
}

document.querySelectorAll(".btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (btn.dataset.number !== undefined) {
      if (btn.dataset.number === ".") inputDecimal();
      else inputNumber(btn.dataset.number);
    } else if (btn.dataset.operator) {
      chooseOperator(btn.dataset.operator);
    } else if (btn.dataset.action === "clear") {
      clearAll();
    } else if (btn.dataset.action === "equals") {
      if (operator) compute();
      waitingForOperand = true;
      updateDisplay();
    } else if (btn.dataset.action === "percent") {
      calculatePercent();
    }
  });
});

updateDisplay();
