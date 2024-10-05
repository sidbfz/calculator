// Store current and previous values, and the operator
let currentNumber = '';
let previousNumber = '';
let operator = '';
let shouldResetDisplay = false;
const display = document.getElementById('display');
const previousDisplay = document.getElementById('previous-display');

// Operation functions
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) {
    return "Error";
  }
  return a / b;
}

function operate(operator, a, b) {
  a = parseFloat(a);
  b = parseFloat(b);
  switch (operator) {
    case '+':
      return add(a, b);
    case '-':
      return subtract(a, b);
    case '*':
      return multiply(a, b);
    case '/':
      return divide(a, b);
    default:
      return null;
  }
}

function updateDisplay(value) {
  display.textContent = value;
}

function updatePreviousDisplay() {
  previousDisplay.textContent = `${previousNumber} ${operator}`;
}

function clearCalculator() {
  currentNumber = '';
  previousNumber = '';
  operator = '';
  updateDisplay('0');
  previousDisplay.textContent = '';
}

// Backspace function
function backspace() {
  if (currentNumber.length > 0) {
    currentNumber = currentNumber.slice(0, -1);
    if (currentNumber === '') currentNumber = '0';
    updateDisplay(currentNumber);
  }
}

// Handle digit and operator clicks
const digits = document.querySelectorAll('.digit');
digits.forEach(digit => {
  digit.addEventListener('click', () => {
    if (shouldResetDisplay) {
      currentNumber = '';
      shouldResetDisplay = false;
    }
    currentNumber += digit.textContent;
    updateDisplay(currentNumber);
  });
});

// Decimal button handler
const decimalButton = document.querySelector('.decimal');
decimalButton.addEventListener('click', () => {
  if (shouldResetDisplay) {
    currentNumber = '0';
    shouldResetDisplay = false;
  }
  if (!currentNumber.includes('.')) {
    currentNumber += '.';
    updateDisplay(currentNumber);
  }
});

// Handle operator clicks
const operators = document.querySelectorAll('.operator');
operators.forEach(op => {
  op.addEventListener('click', () => {
    if (currentNumber === '' && previousNumber === '') return;
    if (currentNumber === '') {
      operator = op.dataset.operator;
      updatePreviousDisplay();
      return;
    }
    if (previousNumber !== '') {
      currentNumber = roundResult(operate(operator, previousNumber, currentNumber)).toString();
      updateDisplay(currentNumber);
    }
    previousNumber = currentNumber;
    operator = op.dataset.operator;
    updatePreviousDisplay();
    shouldResetDisplay = true;
  });
});

// Handle equals button
const equalsButton = document.querySelector('.equal');
equalsButton.addEventListener('click', () => {
  if (currentNumber === '' || previousNumber === '' || operator === '') return;
  currentNumber = roundResult(operate(operator, previousNumber, currentNumber)).toString();
  updateDisplay(currentNumber);
  previousNumber = '';
  operator = '';
  shouldResetDisplay = true;
  previousDisplay.textContent = '';
});

// Handle clear button
const clearButton = document.querySelector('.clear');
clearButton.addEventListener('click', clearCalculator);

// Handle backspace button
const backspaceButton = document.querySelector('.backspace');
backspaceButton.addEventListener('click', backspace);

// Rounding long decimal results
function roundResult(value) {
  return Math.round(value * 10000) / 10000;
}

// Keyboard support
window.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') {
    document.querySelector(`.digit[data-key="${e.key}"]`)?.click();
  } else if (e.key === '.') {
    decimalButton.click();
  } else if (e.key === 'Backspace') {
    backspaceButton.click();
  } else if (e.key === 'Enter' || e.key === '=') {
    equalsButton.click();
  } else if (e.key === 'Escape') {
    clearButton.click();
  } else if (['+', '-', '*', '/'].includes(e.key)) {
    document.querySelector(`button.operator[data-operator="${e.key}"]`)?.click();
  }
});