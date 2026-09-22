# 🧮 Casio fx-991 PRO — Scientific & Base-N Programmer Calculator

Inspired by the iconic **Casio fx-991EX ClassWiz**, this advanced web calculator brings engineering-grade scientific math and a full **Base-N Programmer Engine** (DEC, HEX, BIN, OCT) into a sleek, glassmorphic browser experience.

---

## 🛠️ Tech Stack

- **Frontend:** Semantic HTML5, Glassmorphism CSS3 (Responsive Grid, JetBrains Mono font, smooth slide-over tape drawer)
- **Engine:** Vanilla JavaScript (ES6+, Multi-Radix Base Conversion Engine, Trigonometric Angle Evaluators, Safe Function-Based Math Parser)
- **Storage:** Browser `localStorage` for Calculation History Tape and User Preferences
- **Deployment:** GitHub Pages

---

## ✨ Features

- 🔢 **Full Base-N Programmer Mode (Casio Style):**
  - **4 Number Bases:** Instant switching between **DEC** (Decimal), **HEX** (Hexadecimal), **BIN** (Binary), and **OCT** (Octal).
  - **Live Multi-Base Conversion Strip:** Simultaneous live readout of the active number across all 4 bases (e.g., `DEC: 42` = `HEX: 2A` = `OCT: 52` = `BIN: 101010`).
  - **Casio Hexadecimal Keys (A, B, C, D, E, F):** Dedicated alpha input keys that light up in HEX mode.
  - **Intelligent Key Masking:** Automatically disables invalid digits based on active radix (restricts to `0`–`1` in BIN mode, `0`–`7` in OCT mode).

- 🔬 **Casio Scientific Functions:**
  - **Algebra & Powers:** `x!` (Factorial), `xʸ` (Custom power), `x²`, `√` (Square root).
  - **Advanced Math:** `1/x` (Reciprocal), `|x|` (Absolute value), `mod` (Modulo remainder).
  - **Logarithms & Constants:** `log₁₀`, `ln` (Natural logarithm), `π` (Pi), and `e` (Euler's number).
  - **Trigonometry:** `sin`, `cos`, `tan` with one-tap **DEG / RAD** angle mode toggle.

- 🖥️ **Dual-Line Expression Display:**
  - Shows the entire expression history above the active entry line (e.g. `sin(30) + 5! =`), mimicking real Casio natural display screens.

- 📜 **Calculation History Tape:**
  - Slide-over drawer records past calculations, operation base, and results.
  - Click any history item to reload its value immediately into the display.
  - Stored persistently in browser `localStorage`.

- ⌨️ **Full Keyboard Shortcuts:**
  - Standard numeric keys, operators (`+`, `-`, `*`, `/`), parentheses, and decimals.
  - `A` through `F` keyboard support when in HEX mode.
  - `Enter` or `=` to calculate; `Backspace` to delete; `Escape` to clear.

---

## 🚀 Live Demo

Calculate live in your browser:  
👉 **[https://akhil-tech258.github.io/Calc/](https://akhil-tech258.github.io/Calc/)**
