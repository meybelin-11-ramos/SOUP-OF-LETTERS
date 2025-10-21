document.addEventListener("DOMContentLoaded", () => {
  const sopa = document.getElementById("sopa");
  const generar = document.getElementById("generar");
  const palabrasInput = document.getElementById("palabras");
  const listaPalabrasDiv = document.getElementById("palabras-lista");
  const botonModo = document.getElementById("modo");

  const gridSize = 12; // 🔹 Aumentamos el tamaño para más dificultad
  const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let matriz = [];
  let seleccionadas = [];
  let palabras = [];
  let esModerador = false;

  function generarSopa() {
    sopa.innerHTML = "";
    listaPalabrasDiv.innerHTML = "";
    palabras = palabrasInput.value
      .toUpperCase()
      .split(",")
      .map(p => p.trim())
      .filter(Boolean);

    palabras.forEach(p => {
      const span = document.createElement("span");
      span.textContent = p;
      listaPalabrasDiv.appendChild(span);
    });

    // Crear matriz vacía
    matriz = Array.from({ length: gridSize }, () =>
      Array.from({ length: gridSize }, () => "")
    );

    // Colocar palabras en direcciones aleatorias
    palabras.forEach(palabra => colocarPalabra(palabra));

    // Rellenar huecos con letras aleatorias
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (matriz[i][j] === "") {
          matriz[i][j] = letras[Math.floor(Math.random() * letras.length)];
        }
      }
    }

    // Mostrar sopa
    matriz.flat().forEach((letra, index) => {
      const celda = document.createElement("div");
      celda.classList.add("letra");
      celda.textContent = letra;
      celda.dataset.index = index;
      sopa.appendChild(celda);
    });
  }

  // 🧭 Colocar palabra en direcciones aleatorias
  function colocarPalabra(palabra) {
    const direcciones = [
      [0, 1],   // derecha →
      [0, -1],  // izquierda ←
      [1, 0],   // abajo ↓
      [-1, 0],  // arriba ↑
      [1, 1],   // diagonal ↘
      [1, -1],  // diagonal ↙
      [-1, 1],  // diagonal ↗
      [-1, -1], // diagonal ↖
    ];

    let colocada = false;
    let intentos = 0;

    while (!colocada && intentos < 100) {
      intentos++;
      const dir = direcciones[Math.floor(Math.random() * direcciones.length)];
      const [dx, dy] = dir;
      const fila = Math.floor(Math.random() * gridSize);
      const col = Math.floor(Math.random() * gridSize);

      if (puedeColocarse(palabra, fila, col, dx, dy)) {
        for (let i = 0; i < palabra.length; i++) {
          matriz[fila + i * dx][col + i * dy] = palabra[i];
        }
        colocada = true;
      }
    }
  }

  // 🧩 Verifica si puede colocarse una palabra en cierta posición
  function puedeColocarse(palabra, fila, col, dx, dy) {
    for (let i = 0; i < palabra.length; i++) {
      const x = fila + i * dx;
      const y = col + i * dy;

      if (x < 0 || x >= gridSize || y < 0 || y >= gridSize) return false;
      if (matriz[x][y] !== "" && matriz[x][y] !== palabra[i]) return false;
    }
    return true;
  }

  // 🎯 Selección y detección
  sopa.addEventListener("click", (e) => {
    if (!e.target.classList.contains("letra")) return;

    const celda = e.target;
    celda.classList.toggle("seleccionada");

    const index = parseInt(celda.dataset.index);
    const fila = Math.floor(index / gridSize);
    const col = index % gridSize;
    const letra = matriz[fila][col];

    if (celda.classList.contains("seleccionada")) {
      seleccionadas.push(letra);
    } else {
      seleccionadas.splice(seleccionadas.indexOf(letra), 1);
    }

    verificarPalabra();
  });

  function verificarPalabra() {
    const palabraFormada = seleccionadas.join("");
    if (palabras.includes(palabraFormada)) {
      marcarEncontrada(palabraFormada);
    }
  }

  function marcarEncontrada(palabra) {
    const letrasSeleccionadas = document.querySelectorAll(".letra.seleccionada");
    letrasSeleccionadas.forEach(l => {
      l.classList.remove("seleccionada");
      l.classList.add("encontrada");
    });

    const spans = listaPalabrasDiv.querySelectorAll("span");
    spans.forEach(s => {
      if (s.textContent === palabra) s.classList.add("encontrada");
    });

    seleccionadas = [];
  }

  // 🔐 Modo moderador
  botonModo.addEventListener("click", () => {
    if (!esModerador) {
      const clave = prompt("Introduce la contraseña del moderador:");
      if (clave === "admin123") {
        esModerador = true;
        palabrasInput.removeAttribute("readonly");
        botonModo.textContent = "Modo moderador 🟢";
        botonModo.classList.add("activo");
      } else {
        alert("Contraseña incorrecta ❌");
      }
    } else {
      esModerador = false;
      palabrasInput.setAttribute("readonly", true);
      botonModo.textContent = "Modo moderador 🔒";
      botonModo.classList.remove("activo");
    }
  });

  generar.addEventListener("click", generarSopa);
  generarSopa();
});
