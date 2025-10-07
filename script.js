// Simple, robust calculator logic
const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');

const isOperator = ch => ['+','-','*','/'].includes(ch);

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    const value = btn.dataset.value;       // numeric/operators/parenthesis
    const action = btn.dataset.action;     // clear/back/equals

    if (action === 'clear') {
      display.value = '';
      return;
    }

    if (action === 'back') {
      display.value = display.value.slice(0, -1);
      return;
    }

    if (action === 'equals') {
      evaluateExpression();
      return;
    }

    // If a plain value (number/operator/paren/decimal)
    if (value !== undefined) {
      appendValue(value);
    }
  });
});

function appendValue(val) {
  const cur = display.value;

  // handle decimal: prevent multiple decimals in same number segment
  if (val === '.') {
    const lastOpIdx = Math.max(
      cur.lastIndexOf('+'),
      cur.lastIndexOf('-'),
      cur.lastIndexOf('*'),
      cur.lastIndexOf('/'),
      cur.lastIndexOf('('),
      cur.lastIndexOf(')')
    );
    const numberPart = cur.slice(lastOpIdx + 1);
    if (numberPart.includes('.')) return;         // already has decimal
    if (numberPart === '') display.value += '0';  // start with 0.
    display.value += '.';
    return;
  }

  // handle operators: avoid duplicate operators (replace if last is operator)
  if (isOperator(val)) {
    if (cur === '' && val !== '-') return; // don't start with operator except minus
    const lastChar = cur.slice(-1);
    if (isOperator(lastChar)) {
      // replace last operator with new one
      display.value = cur.slice(0, -1) + val;
      return;
    }
    display.value += val;
    return;
  }

  // parentheses and digits: just append
  display.value += val;
}

function evaluateExpression() {
  const expr = display.value.trim();
  if (expr === '') return;

  // basic safety: allow only digits, operators, parentheses, spaces and dot
  if (!/^[0-9+\-*/().\s]+$/.test(expr)) {
    display.value = 'Error';
    return;
  }

  try {
    // Evaluate using Function to avoid eval string directness
    // wrapping with parentheses allows expression like "-2+3"
    const result = Function('"use strict";return (' + expr + ')')();
    display.value = String(result);
  } catch (e) {
    display.value = 'Error';
  }
}
