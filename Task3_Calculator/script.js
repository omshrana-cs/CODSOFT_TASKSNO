
const resultDisplay = document.getElementById('result');
const expressionDisplay = document.getElementById('expression');
const keys = document.getElementById('keys');

let current = '0';
let stored = null;
let operator = null;
let waitingForNumber = false;
let justCalculated = false;

function formatNumber(value) {
    if (!Number.isFinite(value)) {
        return 'Error';
    }

    return String(Number(value.toPrecision(12)));
}

function updateDisplay() {
    resultDisplay.textContent = current;
}

function inputDigit(digit) {
    if (
        current === 'Error' ||
        waitingForNumber ||
        justCalculated
    ) {
        current = digit;
        waitingForNumber = false;
        justCalculated = false;
    } else if (
        current.replace('-', '').replace('.', '').length < 14
    ) {
        current = current === '0'
            ? digit
            : current + digit;
    }

    updateDisplay();
}

function inputDecimal() {
    if (
        current === 'Error' ||
        waitingForNumber ||
        justCalculated
    ) {
        current = '0.';
        waitingForNumber = false;
        justCalculated = false;
    } else if (!current.includes('.')) {
        current += '.';
    }

    updateDisplay();
}

function calculate(a, b, op) {
    if (op === '+') {
        return a + b;
    }

    if (op === '-') {
        return a - b;
    }

    if (op === '*') {
        return a * b;
    }

    if (op === '/') {
        return b === 0 ? NaN : a / b;
    }

    return b;
}

function chooseOperator(nextOperator) {
    if (current === 'Error') {
        return;
    }

    const value = Number(current);

    if (operator && !waitingForNumber) {
        const outcome = calculate(stored, value, operator);

        if (!Number.isFinite(outcome)) {
            current = 'Error';
            stored = null;
            operator = null;
            waitingForNumber = true;
            justCalculated = true;

            expressionDisplay.textContent =
                'Cannot divide by zero';

            updateDisplay();
            return;
        }

        current = formatNumber(outcome);
        updateDisplay();
    }

    stored = Number(current);
    operator = nextOperator;
    waitingForNumber = true;
    justCalculated = false;

    const symbols = {
        '+': '+',
        '-': '−',
        '*': '×',
        '/': '÷'
    };

    expressionDisplay.textContent =
        `${current} ${symbols[nextOperator]}`;
}

function equals() {
    if (
        operator === null ||
        stored === null ||
        waitingForNumber ||
        current === 'Error'
    ) {
        return;
    }

    const first = stored;
    const second = Number(current);
    const activeOperator = operator;

    const symbols = {
        '+': '+',
        '-': '−',
        '*': '×',
        '/': '÷'
    };

    const outcome = calculate(
        first,
        second,
        activeOperator
    );

    expressionDisplay.textContent =
        `${first} ${symbols[activeOperator]} ${second} =`;

    if (!Number.isFinite(outcome)) {
        current = 'Error';
        expressionDisplay.textContent =
            'Cannot divide by zero';
    } else {
        current = formatNumber(outcome);
    }

    stored = null;
    operator = null;
    waitingForNumber = true;
    justCalculated = true;

    updateDisplay();
}

function clearAll() {
    current = '0';
    stored = null;
    operator = null;
    waitingForNumber = false;
    justCalculated = false;

    expressionDisplay.textContent =
        'Ready when you are';

    updateDisplay();
}

function changeSign() {
    if (current === 'Error' || Number(current) === 0) {
        return;
    }

    current = formatNumber(-Number(current));
    justCalculated = false;

    updateDisplay();
}

function percentage() {
    if (current === 'Error') {
        return;
    }

    current = formatNumber(Number(current) / 100);
    justCalculated = false;

    updateDisplay();
}

function backspace() {
    if (
        current === 'Error' ||
        waitingForNumber ||
        justCalculated
    ) {
        current = '0';
        waitingForNumber = false;
        justCalculated = false;
    } else {
        current = current.length > 1
            ? current.slice(0, -1)
            : '0';

        if (current === '-') {
            current = '0';
        }
    }

    updateDisplay();
}

function handleAction(action) {
    if (action === 'clear') {
        clearAll();
    }

    if (action === 'sign') {
        changeSign();
    }

    if (action === 'percent') {
        percentage();
    }

    if (action === 'decimal') {
        inputDecimal();
    }

    if (action === 'backspace') {
        backspace();
    }

    if (action === 'equals') {
        equals();
    }
}

keys.addEventListener('click', function (event) {
    const button = event.target.closest('button');

    if (!button) {
        return;
    }

    if (button.dataset.digit !== undefined) {
        inputDigit(button.dataset.digit);
    } else if (button.dataset.operator) {
        chooseOperator(button.dataset.operator);
    } else if (button.dataset.action) {
        handleAction(button.dataset.action);
    }
});

document.addEventListener('keydown', function (event) {
    if (/^[0-9]$/.test(event.key)) {
        inputDigit(event.key);
    } else if (event.key === '.') {
        inputDecimal();
    } else if (
        ['+', '-', '*', '/'].includes(event.key)
    ) {
        chooseOperator(event.key);
    } else if (
        event.key === 'Enter' ||
        event.key === '='
    ) {
        event.preventDefault();
        equals();
    } else if (event.key === 'Backspace') {
        backspace();
    } else if (event.key === 'Escape') {
        clearAll();
    } else if (event.key === '%') {
        percentage();
    }
});
