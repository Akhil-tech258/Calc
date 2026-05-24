function append(value) {
    document.getElementById("display").value += value;
}

function clearDisplay() {
    document.getElementById("display").value = "";
}

function backspace() {
    let d = document.getElementById("display");
    d.value = d.value.slice(0, -1);
}

function calculate() {
    try {
        document.getElementById("display").value =
        eval(document.getElementById("display").value);
    } catch {
        document.getElementById("display").value = "Error";
    }
}

function sin() {
    let v = document.getElementById("display").value;
    document.getElementById("display").value = Math.sin(v * Math.PI / 180);
}

function cos() {
    let v = document.getElementById("display").value;
    document.getElementById("display").value = Math.cos(v * Math.PI / 180);
}

function tan() {
    let v = document.getElementById("display").value;
    document.getElementById("display").value = Math.tan(v * Math.PI / 180);
}

function sqrt() {
    let v = document.getElementById("display").value;
    document.getElementById("display").value = Math.sqrt(v);
}

function power() {
    let v = document.getElementById("display").value;
    document.getElementById("display").value = Math.pow(v, 2);
}
