# 🧮 Scientific Calculator — Modern Web Math Engine

A sleek, responsive scientific calculator web application designed with modern glassmorphism aesthetics, advanced mathematical function parsing, calculation history tape persistence, and native keyboard navigation.

---

## 🛠️ Tech Stack

- **Frontend:** Semantic HTML5, Glassmorphism CSS3 (Grid layout, JetBrains Mono font, smooth drawer animations)
- **Engine:** Vanilla JavaScript (ES6+, Math API, Event Handlers, LocalStorage Persistence)
- **Deployment:** GitHub Pages

---

## ✨ Features

- 📐 **Trigonometric & Advanced Math Engine:**
  - Standard arithmetic: `+`, `−`, `×`, `÷`, `%`, parentheses.
  - Scientific functions: `sin`, `cos`, `tan`, `√` (square root), `x²` (power of two), `log₁₀`.
  - Mathematical constants: `π` (Pi = 3.141592) and `e` (Euler's number = 2.718281).

- 🔄 **DEG / RAD Mode Switcher:**
  - One-tap toggle to switch between **Degrees** and **Radians** for accurate trigonometric problem solving.
  - Active mode indicator displayed prominently on the toolbar.

- 🖥️ **Dual-Line Expression Display:**
  - Sub-display records the previous equation (e.g. `sin(45) =`), while the primary display formats the active numeric entry and evaluation result.

- 📜 **Calculation History Tape:**
  - Slide-over history drawer tracks previous calculations and timestamps.
  - Clicking any recorded calculation item immediately loads the result back into the active display for continuous calculations.
  - Saved persistently in browser `localStorage`.

- ⌨️ **Full Keyboard Shortcut Support:**
  - Enter numbers and operators directly via physical keyboard or numpad.
  - `Enter` or `=` calculates result; `Backspace` deletes characters; `Escape` clears display.

---

## 🚀 Live Demo

Try the scientific calculator live:  
👉 **[https://akhil-tech258.github.io/Calc/](https://akhil-tech258.github.io/Calc/)**
