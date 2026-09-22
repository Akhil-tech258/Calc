let isRadians = false;
let currentInput = "0";
let expression = "";
let isResultEvaluated = false;

const display = document.getElementById("display");
const prevExpression = document.getElementById("prevExpression");
const degRadBtn = document.getElementById("degRadBtn");
const historyDrawer = document.getElementById("historyDrawer");
const historyList = document.getElementById("historyList");

// Load history from localStorage
let history = JSON.parse(localStorage.getItem("calc_history") || "[]");

function updateDisplay() {
    display.value = currentInput;
    prevExpression.textContent = expression;
}

function append(val) {
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

function appendMathConst(constantName) {
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
    try {
        const val = parseFloat(currentInput);
        const res = Math.sin(toAngle(val));
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
    try {
        const val = parseFloat(currentInput);
        const res = Math.cos(toAngle(val));
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
    try {
        const val = parseFloat(currentInput);
        const res = Math.tan(toAngle(val));
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
        if (val < 0) throw new Error("Negative square root");
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

function power() {
    try {
        const val = parseFloat(currentInput);
        const res = Math.pow(val, 2);
        recordHistory(`(${currentInput})²`, res);
        currentInput = parseFloat(res.toFixed(8)).toString();
        isResultEvaluated = true;
        updateDisplay();
    } catch {
        currentInput = "Error";
        updateDisplay();
    }
}

function log10() {
    try {
        const val = parseFloat(currentInput);
        if (val <= 0) throw new Error("Invalid log input");
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

function calculate() {
    try {
        let sanitized = currentInput.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
        // Prevent unsafe evaluation characters
        if (/[^0-9+\-*/().\s]/.test(sanitized)) {
            throw new Error("Invalid characters");
        }
        const evaluated = Function(`'use strict'; return (${sanitized})`)();
        const formattedRes = parseFloat(evaluated.toFixed(8)).toString();
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

// History Tape Functions
function recordHistory(expr, result) {
    history.unshift({ expr, result, timestamp: Date.now() });
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
            <div class="history-item-expr">${escapeHtml(item.expr)} =</div>
            <div class="history-item-res">${escapeHtml(item.result.toString())}</div>
        </div>
    `).join('');
}

function loadFromHistory(idx) {
    if (history[idx]) {
        currentInput = history[idx].result.toString();
        expression = history[idx].expr;
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

// Event Listeners
document.getElementById("degRadBtn").addEventListener("click", toggleDegRad);
document.getElementById("historyToggleBtn").addEventListener("click", () => {
    historyDrawer.classList.toggle("open");
    renderHistory();
});
document.getElementById("drawerCloseBtn").addEventListener("click", () => {
    historyDrawer.classList.remove("open");
});
document.getElementById("clearHistoryBtn").addEventListener("click", () => {
    history = [];
    localStorage.removeItem("calc_history");
    renderHistory();
});

// Keyboard Support
window.addEventListener("keydown", (e) => {
    if ((e.key >= '0' && e.key <= '9') || ['+', '-', '*', '/', '.', '(', ')'].includes(e.key)) {
        append(e.key);
    } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calculate();
    } else if (e.key === 'Backspace') {
        backspace();
    } else if (e.key === 'Escape') {
        clearDisplay();
    }
});

// Initial Render
renderHistory();
updateDisplay();
