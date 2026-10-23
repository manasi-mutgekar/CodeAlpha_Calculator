const currentOperandElement = document.getElementById("current-operand");
const previousOperandElement = document.getElementById("previous-operand");
const buttons = document.querySelector(".buttons");

let currentOperand = "0";
let previousOperand = "";
let operator = null;
let shouldResetScreen = false;

function updateDisplay() {
  currentOperandElement.textContent = currentOperand;
  previousOperandElement.textContent = operator
    ? `${previousOperand} ${operator}`
    : "";
}

function enterNumber(number) {
  if (currentOperand === "Error" || shouldResetScreen) {
    currentOperand = number;
    shouldResetScreen = false;
    return;
  }

  if (currentOperand === "0") {
    currentOperand = number;
  } else if (currentOperand.length < 16) {
    currentOperand += number;
  }
}

function enterDecimal() {
  if (currentOperand === "Error" || shouldResetScreen) {
    currentOperand = "0.";
    shouldResetScreen = false;
    return;
  }

  if (!currentOperand.includes(".")) {
    currentOperand += ".";
  }
}

function chooseOperator(nextOperator) {
  if (currentOperand === "Error") return;

  if (operator && !shouldResetScreen) {
    calculate();
  }

  previousOperand = currentOperand;
  operator = nextOperator;
  shouldResetScreen = true;
}

function calculate() {
  if (!operator || previousOperand === "" || currentOperand === "Error") {
    return;
  }

  const first = Number(previousOperand);
  const second = Number(currentOperand);
  let result;

  switch (operator) {
    case "+":
      result = first + second;
      break;
    case "−":
      result = first - second;
      break;
    case "×":
      result = first * second;
      break;
    case "÷":
      if (second === 0) {
        currentOperand = "Cannot divide by zero";
        previousOperand = "";
        operator = null;
        shouldResetScreen = true;
        updateDisplay();
        return;
      }
      result = first / second;
      break;
    default:
      return;
  }

  currentOperand = Number.isFinite(result)
    ? String(Number(result.toPrecision(12)))
    : "Error";

  previousOperand = "";
  operator = null;
  shouldResetScreen = true;
}

function clearCalculator() {
  currentOperand = "0";
  previousOperand = "";
  operator = null;
  shouldResetScreen = false;
}

function deleteDigit() {
  if (currentOperand === "Error" || shouldResetScreen) {
    currentOperand = "0";
    shouldResetScreen = false;
    return;
  }

  currentOperand = currentOperand.length > 1
    ? currentOperand.slice(0, -1)
    : "0";

  if (currentOperand === "-") {
    currentOperand = "0";
  }
}

function toggleSign() {
  if (currentOperand === "0" || currentOperand === "Error") return;

  currentOperand = currentOperand.startsWith("-")
    ? currentOperand.slice(1)
    : `-${currentOperand}`;
}

function handleAction(action) {
  switch (action) {
    case "clear":
      clearCalculator();
      break;
    case "delete":
      deleteDigit();
      break;
    case "decimal":
      enterDecimal();
      break;
    case "equals":
      calculate();
      break;
    case "sign":
      toggleSign();
      break;
  }

  updateDisplay();
}

buttons.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.dataset.number !== undefined) {
    enterNumber(button.dataset.number);
    updateDisplay();
  } else if (button.dataset.operator) {
    chooseOperator(button.dataset.operator);
    updateDisplay();
  } else if (button.dataset.action) {
    handleAction(button.dataset.action);
  }
});

document.addEventListener("keydown", (event) => {
  const key = event.key;

  if (/^[0-9]$/.test(key)) {
    enterNumber(key);
  } else if (key === ".") {
    enterDecimal();
  } else if (key === "+") {
    chooseOperator("+");
  } else if (key === "-") {
    chooseOperator("−");
  } else if (key === "*") {
    chooseOperator("×");
  } else if (key === "/") {
    event.preventDefault();
    chooseOperator("÷");
  } else if (key === "Enter" || key === "=") {
    event.preventDefault();
    calculate();
  } else if (key === "Backspace") {
    deleteDigit();
  } else if (key === "Escape") {
    clearCalculator();
  } else {
    return;
  }

  updateDisplay();
});

updateDisplay();