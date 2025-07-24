document.addEventListener("DOMContentLoaded", function () {
  const gradeInput = document.getElementById("grade-input");
  const addGradeBtn = document.getElementById("add-grade");
  const gradesList = document.getElementById("grades-list");
  const averageElement = document.getElementById("average");
  const statusElement = document.getElementById("status");
  const calculateBtn = document.getElementById("calculate-btn");
  const resetBtn = document.getElementById("reset-btn");
  const resultContainer = document.getElementById("result-container");

  // Cargar notas desde localStorage o iniciar vacío
  let grades = JSON.parse(localStorage.getItem("grades")) || [];

  // Ocultar listas y resultados al inicio si no hay notas
  if (grades.length === 0) {
    gradesList.style.display = "none";
    resultContainer.style.display = "none";
  } else {
    renderGrades();
    calculateAverage();
  }

  // Agregar nota
  addGradeBtn.addEventListener("click", addGrade);
  gradeInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      addGrade();
    }
  });

  // Calcular promedio
  calculateBtn.addEventListener("click", calculateAverage);

  // Limpiar todo
  resetBtn.addEventListener("click", resetCalculator);

  function addGrade() {
    const value = parseFloat(gradeInput.value);

    if (isNaN(value) || value < 0 || value > 7) {
      alert("Por favor ingresa una nota válida entre 0.0 y 7.0");
      return;
    }

    // Redondear a un decimal
    const roundedValue = Math.round(value * 10) / 10;

    grades.push(roundedValue);
    saveGrades();
    renderGrades();
    gradeInput.value = "";
    gradeInput.focus();
  }

  function renderGrades() {
    if (grades.length === 0) {
      gradesList.style.display = "none";
      gradesList.innerHTML = `
              <div class="empty-state">
                  <i class="fas fa-clipboard-list"></i>
                  <p>No hay notas agregadas</p>
              </div>
          `;
      return;
    }

    gradesList.style.display = "block";
    gradesList.innerHTML = "";

    grades.forEach((grade, index) => {
      const gradeItem = document.createElement("div");
      gradeItem.className = "grade-item";
      gradeItem.innerHTML = `
              <div class="grade-value">${grade.toFixed(1)}</div>
              <button class="delete-btn" data-index="${index}">
                  <i class="fas fa-times"></i>
              </button>
          `;
      gradesList.appendChild(gradeItem);
    });

    // Agregar event listeners a los botones de eliminar
    document.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const index = parseInt(this.getAttribute("data-index"));
        if (confirm("¿Estás seguro que deseas eliminar esta nota?")) {
          grades.splice(index, 1);
          saveGrades();
          renderGrades();
          calculateAverage();
        }
      });
    });
  }

  function calculateAverage() {
    if (grades.length === 0) {
      averageElement.textContent = "--";
      averageElement.classList.remove("failed", "approved");
      statusElement.textContent = "Esperando notas...";
      statusElement.className = "status";
      resultContainer.style.display = "none";
      return;
    }

    const sum = grades.reduce((acc, grade) => acc + grade, 0);
    const average = sum / grades.length;

    // Redondear a un decimal
    const roundedAverage = Math.round(average * 10) / 10;
    averageElement.textContent = roundedAverage.toFixed(1);

    // Determinar estado (en Chile, 4.0 es el mínimo para aprobar)
    if (roundedAverage >= 4.0) {
      statusElement.textContent = "Aprobado";
      statusElement.className = "status approved";
      averageElement.classList.remove("failed");
      averageElement.classList.add("approved");
    } else {
      statusElement.textContent = "Reprobado";
      statusElement.className = "status failed";
      averageElement.classList.remove("approved");
      averageElement.classList.add("failed");
    }
    resultContainer.style.display = "block";
  }

  function resetCalculator() {
    if (confirm("¿Estás seguro que deseas limpiar todas las notas?")) {
      grades = [];
      saveGrades();
      renderGrades();
      averageElement.textContent = "--";
      statusElement.textContent = "Esperando notas...";
      statusElement.className = "status";
      gradeInput.value = "";
      gradeInput.focus();
      resultContainer.style.display = "none";
      gradesList.style.display = "none";
    }
  }

  // Guardar notas en localStorage
  function saveGrades() {
    localStorage.setItem("grades", JSON.stringify(grades));
  }
});
