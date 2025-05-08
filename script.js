const form = document.getElementById("gastoForm");
const tabla = document.querySelector("#tablaGastos tbody");

const roomies = ["Marcelo", "Eli", "Mauricio"];
let gastos = JSON.parse(localStorage.getItem("gastos")) || [];

mostrarGastos();

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const servicio = document.getElementById("servicio").value;
  const montoTotal = parseFloat(document.getElementById("monto").value);
  const fecha = document.getElementById("fecha").value;

  const nuevoGasto = {
    servicio,
    montoTotal,
    fecha,
    pagos: {
      Marcelo: false,
      Eli: false,
      Mauricio: false
    }
  };

  gastos.push(nuevoGasto);
  guardarGastos();
  mostrarGastos();
  form.reset();
});

function mostrarGastos() {
  tabla.innerHTML = "";

  const hoy = new Date().toISOString().split("T")[0];

  gastos.forEach((gasto, index) => {
    let estado = "pendiente";
    if (gasto.fecha < hoy) estado = "vencido";
    else if (gasto.fecha === hoy) estado = "hoy";
    else if (Object.values(gasto.pagos).every(v => v)) estado = "pagado";

    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${gasto.servicio}</td>
      <td>$${gasto.montoTotal.toFixed(2)}</td>
      <td>${gasto.fecha}</td>
      ${roomies.map(r => `
        <td>
          <input type="checkbox" ${gasto.pagos[r] ? "checked" : ""} onchange="marcarPago(${index}, '${r}')">
        </td>
      `).join("")}
      <td class="status ${estado}">${estado.toUpperCase()}</td>
      <td><button onclick="eliminarGasto(${index})">Eliminar</button></td>
    `;
    tabla.appendChild(fila);
  });
}

function marcarPago(index, roomie) {
  gastos[index].pagos[roomie] = !gastos[index].pagos[roomie];
  guardarGastos();
  mostrarGastos();
}

function eliminarGasto(index) {
  gastos.splice(index, 1);
  guardarGastos();
  mostrarGastos();
}

function guardarGastos() {
  localStorage.setItem("gastos", JSON.stringify(gastos));
}
