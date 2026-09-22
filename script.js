let isRadians = false;
let currentBase = 'dec'; // 'dec', 'hex', 'oct', 'bin'
let currentInput = "0";
let expression = "";
let isResultEvaluated = false;

const display = document.getElementById("display");
const prevExpression = document.getElementById("prevExpression");
const degRadBtn = document.getElementById("degRadBtn");
const historyToggleBtn = document.getElementById("historyToggleBtn");
const historyDrawer = document.getElementById("historyDrawer");
const historyList = document.getElementById("historyList");
const drawerCloseBtn = document.getElementById("drawerCloseBtn");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");
const btnDot = document.getElementById("btnDot");
const activeBaseChip = document.getElementById("activeBaseChip");

// Base readout elements
const baseItems = document.querySelectorAll(".base-item");
const baseValDec = document.getElementById("baseValDec");
const baseValHex = document.getElementById("baseValHex");
const baseValOct = document.getElementById("baseValOct");
const baseValBin = document.getElementById("baseValBin");

// Load history from localStorage
let history = JSON.parse(localStorage.getItem("calc_history") || "[]");

function getRadix(base) {
    switch (base) {
        case 'hex': return 16;
        case 'oct': return 8;
        case 'bin': return 2;
        default: return 10;
    }
}

function updateBaseNReadout(val) {
    if (!val || val === "Error") {
        baseValDec.textContent = "0";
        baseValHex.textContent = "0";
        baseValOct.textContent = "0";
        baseValBin.textContent = "0";
        return;
    }
    try {
        let intVal;
        const radix = getRadix(currentBase);

        if (/[\+\-\*\/]/.test(val)) {
            const parts = val.split(/[\+\-\*\/]/);
            const lastPart = parts[parts.length - 1].trim();
            intVal = lastPart ? parseInt(lastPart, radix) : 0;
        } else {
            intVal = currentBase === 'dec' ? Math.trunc(parseFloat(val)) : parseInt(val, radix);
        }

        if (isNaN(intVal)) {
            baseValDec.textContent = "—";
            baseValHex.textContent = "—";
            baseValOct.textContent = "—";
            baseValBin.textContent = "—";
            return;
        }

        baseValDec.textContent = intVal.toString(10);
        baseValHex.textContent = intVal.toString(16).toUpperCase();
        baseValOct.textContent = intVal.toString(8);
        baseValBin.textContent = intVal.toString(2);
    } catch {
        baseValDec.textContent = "0";
        baseValHex.textContent = "0";
        baseValOct.textContent = "0";
        baseValBin.textContent = "0";
    }
}

function updateDisplay() {
    display.value = currentInput;
    prevExpression.textContent = expression;
    updateBaseNReadout(currentInput);
    if (activeBaseChip) activeBaseChip.textContent = currentBase.toUpperCase();
}

function setBase(targetBase) {
    if (currentBase === targetBase) return;
    try {
        if (/[\+\-\*\/]/.test(currentInput)) {
            calculate();
        }
        const currentRadix = getRadix(currentBase);
        const targetRadix = getRadix(targetBase);
        let intVal = parseInt(currentInput, currentRadix);
        if (!isNaN(intVal)) {
            currentInput = intVal.toString(targetRadix).toUpperCase();
        } else {
            currentInput = "0";
        }
    } catch {
        currentInput = "0";
    }

    currentBase = targetBase;
    baseItems.forEach(item => {
        item.classList.toggle("active", item.dataset.base === targetBase);
    });

    updateKeyAvailability();
    updateDisplay();
}

function toggleBaseMode() {
    const bases = ['dec', 'hex', 'bin', 'oct'];
    const nextIdx = (bases.indexOf(currentBase) + 1) % bases.length;
    setBase(bases[nextIdx]);
}

function updateKeyAvailability() {
    const hexBtns = document.querySelectorAll(".btn-hex");
    hexBtns.forEach(btn => {
        btn.classList.toggle("disabled", currentBase !== 'hex');
    });

    const numBtns = document.querySelectorAll(".btn-num");
    numBtns.forEach(btn => {
        const num = btn.dataset.num;
        if (num === undefined) return;
        const n = parseInt(num);
        if (currentBase === 'bin') {
            btn.classList.toggle("disabled", n > 1);
        } else if (currentBase === 'oct') {
            btn.classList.toggle("disabled", n > 7);
        } else {
            btn.classList.remove("disabled");
        }
    });

    if (btnDot) {
        btnDot.classList.toggle("disabled", currentBase !== 'dec');
    }
}

function append(val) {
    if (currentBase === 'bin' && !['0', '1', '+', '-', '*', '/', '(', ')'].includes(val)) return;
    if (currentBase === 'oct' && ['8', '9', '.'].includes(val)) return;
    if (currentBase !== 'dec' && val === '.') return;

    if (isResultEvaluated && !['+', '-', '*', '/'].includes(val)) {
        currentInput = val === '.' ? '0.' : val;
        expression = "";
        isResultEvaluated = false;
    } else {
        if (currentInput === "0" && val !== '.') {
            currentInput = val;
        } else {
            currentInput += val;
        }
        isResultEvaluated = false;
    }
    updateDisplay();
}

function appendHex(char) {
    if (currentBase !== 'hex') return;
    if (isResultEvaluated) {
        currentInput = char;
        expression = "";
        isResultEvaluated = false;
    } else {
        if (currentInput === "0") currentInput = char;
        else currentInput += char;
    }
    updateDisplay();
}

function appendMathConst(constantName) {
    if (currentBase !== 'dec') return;
    const val = constantName === 'PI' ? Math.PI.toFixed(6) : Math.E.toFixed(6);
    if (currentInput === "0" || isResultEvaluated) {
        currentInput = val;
        isResultEvaluated = false;
    } else {
        currentInput += val;
    }
    updateDisplay();
}

function clearDisplay() {
    currentInput = "0";
    expression = "";
    isResultEvaluated = false;
    updateDisplay();
}

function backspace() {
    if (isResultEvaluated) {
        clearDisplay();
        return;
    }
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = "0";
    }
    updateDisplay();
}

function toggleDegRad() {
    isRadians = !isRadians;
    degRadBtn.textContent = isRadians ? "RAD" : "DEG";
    degRadBtn.style.color = isRadians ? "var(--accent-op)" : "var(--accent-cyan)";
}

function toAngle(val) {
    const num = parseFloat(val);
    return isRadians ? num : (num * Math.PI / 180);
}

function sin() {
    if (currentBase !== 'dec') return;
    try {
        const val = parseFloat(currentInput);
        let res = Math.sin(toAngle(val));
        if (!isRadians && Math.abs(val % 180) === 0) res = 0;
        recordHistory(`sin(${currentInput})`, res);
        currentInput = parseFloat(res.toFixed(8)).toString();
        isResultEvaluated = true;
        updateDisplay();
    } catch {
        currentInput = "Error";
        updateDisplay();
    }
}

function cos() {
    if (currentBase !== 'dec') return;
    try {
        const val = parseFloat(currentInput);
        let res = Math.cos(toAngle(val));
        if (!isRadians && Math.abs(val % 180) === 90) res = 0;
        recordHistory(`cos(${currentInput})`, res);
        currentInput = parseFloat(res.toFixed(8)).toString();
        isResultEvaluated = true;
        updateDisplay();
    } catch {
        currentInput = "Error";
        updateDisplay();
    }
}

function tan() {
    if (currentBase !== 'dec') return;
    try {
        const val = parseFloat(currentInput);
        if (!isRadians && Math.abs(val % 180) === 90) {
            currentInput = "Error";
            updateDisplay();
            return;
        }
        let res = Math.tan(toAngle(val));
        if (!isRadians && Math.abs(val % 180) === 0) res = 0;
        recordHistory(`tan(${currentInput})`, res);
        currentInput = parseFloat(res.toFixed(8)).toString();
        isResultEvaluated = true;
        updateDisplay();
    } catch {
        currentInput = "Error";
        updateDisplay();
    }
}

function sqrt() {
    try {
        const val = parseFloat(currentInput);
        if (val < 0) throw new Error("Negative root");
        const res = Math.sqrt(val);
        recordHistory(`√(${currentInput})`, res);
        currentInput = parseFloat(res.toFixed(8)).toString();
        isResultEvaluated = true;
        updateDisplay();
    } catch {
        currentInput = "Error";
        updateDisplay();
    }
}

function power(exp) {
    try {
        const val = parseFloat(currentInput);
        const res = Math.pow(val, exp);
        recordHistory(`(${currentInput})^${exp}`, res);
        currentInput = parseFloat(res.toFixed(8)).toString();
        isResultEvaluated = true;
        updateDisplay();
    } catch {
        currentInput = "Error";
        updateDisplay();
    }
}

function customPower() {
    append('^');
}

function factorial() {
    try {
        const n = parseInt(currentInput);
        if (n < 0 || isNaN(n)) throw new Error("Invalid");
        if (n > 170) throw new Error("Overflow");
        let res = 1;
        for (let i = 2; i <= n; i++) res *= i;
        recordHistory(`${n}!`, res);
        currentInput = res.toString();
        isResultEvaluated = true;
        updateDisplay();
    } catch {
        currentInput = "Error";
        updateDisplay();
    }
}

function reciprocal() {
    try {
        const val = parseFloat(currentInput);
        if (val === 0) throw new Error("Div/0");
        const res = 1 / val;
        recordHistory(`1/(${currentInput})`, res);
        currentInput = parseFloat(res.toFixed(8)).toString();
        isResultEvaluated = true;
        updateDisplay();
    } catch {
        currentInput = "Error";
        updateDisplay();
    }
}

function absVal() {
    try {
        const val = parseFloat(currentInput);
        const res = Math.abs(val);
        recordHistory(`|${currentInput}|`, res);
        currentInput = res.toString();
        isResultEvaluated = true;
        updateDisplay();
    } catch {
        currentInput = "Error";
        updateDisplay();
    }
}

function log10() {
    if (currentBase !== 'dec') return;
    try {
        const val = parseFloat(currentInput);
        if (val <= 0) throw new Error("Invalid log");
        const res = Math.log10(val);
        recordHistory(`log(${currentInput})`, res);
        currentInput = parseFloat(res.toFixed(8)).toString();
        isResultEvaluated = true;
        updateDisplay();
    } catch {
        currentInput = "Error";
        updateDisplay();
    }
}

function ln() {
    if (currentBase !== 'dec') return;
    try {
        const val = parseFloat(currentInput);
        if (val <= 0) throw new Error("Invalid ln");
        const res = Math.log(val);
        recordHistory(`ln(${currentInput})`, res);
        currentInput = parseFloat(res.toFixed(8)).toString();
        isResultEvaluated = true;
        updateDisplay();
    } catch {
        currentInput = "Error";
        updateDisplay();
    }
}

function calculate() {
    try {
        let exprToEval = currentInput
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/−/g, '-')
            .replace(/\^/g, '**');

        let formattedRes;

        if (currentBase === 'dec') {
            if (/[^0-9+\-*/().\s*]/.test(exprToEval)) {
                throw new Error("Invalid characters");
            }
            const evaluated = Function(`'use strict'; return (${exprToEval})`)();
            formattedRes = parseFloat(evaluated.toFixed(8)).toString();
        } else {
            // Base-N evaluation (Hex, Oct, Bin)
            const radix = getRadix(currentBase);
            const tokens = exprToEval.split(/([+\-*/])/).map(t => t.trim()).filter(Boolean);
            if (tokens.length === 1) {
                formattedRes = currentInput;
            } else {
                let acc = parseInt(tokens[0], radix);
                for (let i = 1; i < tokens.length; i += 2) {
                    const op = tokens[i];
                    const nextVal = parseInt(tokens[i + 1], radix);
                    if (op === '+') acc += nextVal;
                    else if (op === '-') acc -= nextVal;
                    else if (op === '*') acc *= nextVal;
                    else if (op === '/') {
                        if (nextVal === 0) throw new Error("Div/0");
                        acc = Math.trunc(acc / nextVal);
                    }
                }
                formattedRes = acc.toString(radix).toUpperCase();
            }
        }

        recordHistory(currentInput, formattedRes);
        expression = currentInput + " =";
        currentInput = formattedRes;
        isResultEvaluated = true;
        updateDisplay();
    } catch {
        currentInput = "Error";
        updateDisplay();
    }
}

// History Tape
function recordHistory(expr, result) {
    history.unshift({ expr, result, base: currentBase, timestamp: Date.now() });
    if (history.length > 25) history.pop();
    localStorage.setItem("calc_history", JSON.stringify(history));
    renderHistory();
}

function renderHistory() {
    if (!historyList) return;
    if (history.length === 0) {
        historyList.innerHTML = `<p class="history-empty">No calculations recorded yet.</p>`;
        return;
    }
    historyList.innerHTML = history.map((item, idx) => `
        <div class="history-item" onclick="loadFromHistory(${idx})">
            <div class="history-item-expr">[${(item.base || 'DEC').toUpperCase()}] ${escapeHtml(item.expr)} =</div>
            <div class="history-item-res">${escapeHtml(item.result.toString())}</div>
        </div>
    `).join('');
}

function loadFromHistory(idx) {
    if (history[idx]) {
        currentInput = history[idx].result.toString();
        expression = history[idx].expr;
        if (history[idx].base) setBase(history[idx].base);
        isResultEvaluated = true;
        updateDisplay();
        historyDrawer.classList.remove("open");
    }
}

function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}

// Base-N click handlers
baseItems.forEach(item => {
    item.addEventListener("click", () => {
        setBase(item.dataset.base);
    });
});

// Event Listeners
if (degRadBtn) degRadBtn.addEventListener("click", toggleDegRad);
if (historyToggleBtn) {
    historyToggleBtn.addEventListener("click", () => {
        historyDrawer.classList.toggle("open");
        renderHistory();
    });
}
if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener("click", () => {
        historyDrawer.classList.remove("open");
    });
}
if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener("click", () => {
        history = [];
        localStorage.removeItem("calc_history");
        renderHistory();
    });
}

// Keyboard Support
window.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();
    if ((key >= '0' && key <= '9') || ['+', '-', '*', '/', '.', '(', ')'].includes(key)) {
        append(e.key);
    } else if (currentBase === 'hex' && ['a', 'b', 'c', 'd', 'e', 'f'].includes(key)) {
        appendHex(key.toUpperCase());
    } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calculate();
    } else if (e.key === 'Backspace') {
        backspace();
    } else if (e.key === 'Escape') {
        clearDisplay();
    }
});

// Initial Setup
updateKeyAvailability();
renderHistory();
updateDisplay();
