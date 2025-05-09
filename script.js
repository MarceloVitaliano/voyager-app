import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const form = document.getElementById("gastoForm");
const tabla = document.querySelector("#tablaGastos tbody");
const roomies = ["Marcelo", "Eli", "Mauricio"];

// 🚨 Solicitar permiso de notificaciones al cargar
if ('Notification' in window && 'serviceWorker' in navigator) {
  Notification.requestPermission().then((permission) => {
    console.log('Permiso de notificaciones:', permission);
  });
}

form.addEventListener("submit", async (e) => {
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
    },
    timestamp: Date.now()
  };

  await addDoc(collection(db, "gastos"), nuevoGasto);
  form.reset();

  // 🔔 Mostrar notificación local
  if (Notification.permission === 'granted') {
    navigator.serviceWorker.getRegistration().then((reg) => {
      if (reg) {
        reg.showNotification("Nuevo servicio agregado 💸", {
          body: `${servicio} fue añadido por un roomie.`,
          icon: "house-icon.png",
          badge: "house-icon.png"
        });
      }
    });
  }
});

// 🔁 Escuchar cambios en tiempo real
onSnapshot(collection(db, "gastos"), (snapshot) => {
  const gastos = [];
  snapshot.forEach((doc) => {
    gastos.push({ id: doc.id, ...doc.data() });
  });
  mostrarGastos(gastos);
});

async function marcarPago(id, roomie, valor) {
  const ref = doc(db, "gastos", id);
  const update = {};
  update[`pagos.${roomie}`] = valor;
  await updateDoc(ref, update);
}

async function eliminarGasto(id) {
  await deleteDoc(doc(db, "gastos", id));
}

function mostrarGastos(gastos) {
  tabla.innerHTML = "";
  const hoy = new Date().toISOString().split("T")[0];

  gastos
    .sort((a, b) => a.timestamp - b.timestamp)
    .forEach((gasto) => {
      let estado = "pendiente";
      if (gasto.fecha < hoy) estado = "vencido";
      else if (gasto.fecha === hoy) estado = "hoy";
      else if (Object.values(gasto.pagos).every(v => v)) estado = "pagado";

      const fila = document.createElement("tr");

      const checkboxCells = roomies.map(r => `
        <td>
          <input type="checkbox" ${gasto.pagos[r] ? "checked" : ""}>
        </td>
      `).join("");

      fila.innerHTML = `
        <td>${gasto.servicio}</td>
        <td>$${gasto.montoTotal.toFixed(2)}</td>
        <td>${gasto.fecha}</td>
        ${checkboxCells}
        <td class="status ${estado}">${estado.toUpperCase()}</td>
        <td><button class="btn-eliminar">Eliminar</button></td>
      `;

      tabla.appendChild(fila);

      fila.querySelector(".btn-eliminar").addEventListener("click", () => {
        eliminarGasto(gasto.id);
      });

      const checkboxes = fila.querySelectorAll("input[type='checkbox']");
      checkboxes.forEach((checkbox, i) => {
        const roomie = roomies[i];
        checkbox.addEventListener("change", () => {
          marcarPago(gasto.id, roomie, checkbox.checked);
        });
      });
    });
}
