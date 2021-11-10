const dbMantenimient = require("../sql/dbMantenimient.js");
const dbOrden = require("../sql/dbOrden.js");

// --------- elements---------------
const tableHistory = document.getElementById("tbodyHistory");
const selectMachine = document.getElementById("selectorMachine");
const dateStart = document.getElementById("dateStart");
const selectorFre = document.getElementById("selectorFrecuencia");
let data;

// ---------- DOM is loaded and ready ---------------

document.addEventListener("DOMContentLoaded", async (e) => {
  const res = await dbMantenimient.getPlan();
  data = res;
  setSelector(selectMachine, data);
});

// ---------- setters ---------------

// data table
async function setTable(date, frecuencia) {
  tableHistory.innerHTML = ""; // reset data

  for (let i = 1; i <= 12; ++i) {
    tableHistory.innerHTML += `<tr>
        <td style="height: 5px; width: 5px;"><input type="checkbox" disabled="disabled"/></td>
           <td style="height: 5px; width: 5px;"><input type="checkbox" disabled="disabled"/></td>
           <td style="height: 5px; width: 5px;"><input type="checkbox" disabled="disabled"/></td>
           <td style="height: 5px; width: 5px;"><input type="checkbox" disabled="disabled"/></td>
           <td style="height: 5px; width: 5px;"><input type="checkbox" disabled="disabled"/></td>
           <td style="height: 5px; width: 5px;"><input type="checkbox" disabled="disabled"/></td>
           <td style="height: 5px; width: 5px;"><input type="checkbox" disabled="disabled"/></td>
           <td style="height: 5px; width: 5px;"><input type="checkbox" disabled="disabled"/></td>
           <td style="height: 5px; width: 5px;"><input type="checkbox" disabled="disabled"/></td>
           <td style="height: 5px; width: 5px;"><input type="checkbox" disabled="disabled"/></td>
           <td style="height: 5px; width: 5px;"><input type="checkbox" disabled="disabled"/></td>
           <td style="height: 5px; width: 5px;"><input type="checkbox" disabled="disabled"/></td>
           <td style="height: 5px; width: 5px;"><input type="checkbox" disabled="disabled"/></td>
           <td style="height: 5px; width: 5px;"><input type="checkbox" disabled="disabled"/></td>
           <td style="height: 5px; width: 5px;"><input type="checkbox" disabled="disabled"/></td>
           <td style="height: 5px; width: 5px;"><input type="checkbox" disabled="disabled"/></td>
           <td style="height: 5px; width: 5px;"><input type="checkbox" disabled="disabled"/></td>
           <td style="height: 5px; width: 5px;"><input type="checkbox" disabled="disabled"/></td>
           <td style="height: 5px; width: 5px;"><input type="checkbox" disabled="disabled"/></td>
           <td style="height: 5px; width: 5px;"><input type="checkbox" disabled="disabled"/></td>
           <td style="height: 5px; width: 5px;"><input type="checkbox" disabled="disabled"/></td>
           <td style="height: 5px; width: 5px;"><input type="checkbox" disabled="disabled"/></td>
           <td style="height: 5px; width: 5px;"><input type="checkbox" disabled="disabled"/></td>
           <td style="height: 5px; width: 5px;"><input type="checkbox" disabled="disabled"/></td>
           <td style="height: 5px; width: 5px;"><input type="checkbox" disabled="disabled"/></td>
           <td style="height: 5px; width: 5px;"><input type="checkbox" disabled="disabled"/></td>
           <td style="height: 5px; width: 5px;"><input type="checkbox" disabled="disabled"/></td>
           <td style="height: 5px; width: 5px;"><input type="checkbox" disabled="disabled"/></td>
           <td style="height: 5px; width: 5px;"><input type="checkbox" disabled="disabled"/></td>
           <td style="height: 5px; width: 5px;"><input type="checkbox" disabled="disabled"/></td>
           <td style="height: 5px; width: 5px;"><input type="checkbox" disabled="disabled"/></td>
        </tr>`;
  }

  let n_fechas = 0,
    aumento = 0;

  switch (frecuencia) {
    case "Semanal":
      n_fechas = 52;
      aumento = 7;
      break;
    case "Trimestral":
      n_fechas = 4;
      aumento = 90;
      break;
    case "Semestral":
      n_fechas = 2;
      aumento = 182;
      break;
    case "Anual":
      n_fechas = 1;
      aumento = 365;
      break;

    default:
      console.log("error");
      break;
  }

  let currentDate = new Date(date);
  for (let i = 1; i <= n_fechas; ++i) {
    currentDate.setDate(currentDate.getDate() + aumento);

    tableHistory.rows[currentDate.getMonth()].cells[
      currentDate.getDate()
    ].innerHTML = `<input type="checkbox" checked disabled="disabled"/>`;

    // currentDate.getFullYear());
  }

  const res = await dbOrden.getDatesOrden(selectMachine.value);

  res.forEach((e) => {
    let currentDate = e.fecha.split("-");

    tableHistory.rows[currentDate[1] - 1].cells[
      currentDate[2] - 1
    ].innerHTML = `<input type="checkbox" checked readonly/>`;
  });
}

function setSelector(selector, data) {
  data.forEach((e) => {
    selector.innerHTML += `<option id='${e.id_plan}'>${e.maquina}</option>`;
  });
}

// table next date
// function setTableDate(date, frecuencia) {
//   let n_fechas = 0,
//     aumento = 0;

//   switch (frecuencia) {
//     case "Semanal":
//       n_fechas = 52;
//       aumento = 7;
//       break;
//     case "Trimestral":
//       n_fechas = 4;
//       aumento = 90;
//       break;
//     case "Semestral":
//       n_fechas = 2;
//       aumento = 182;
//       break;
//     case "Anual":
//       n_fechas = 1;
//       aumento = 365;
//       break;

//     default:
//       console.log("error");
//       break;
//   }

//   var currentDate = new Date(date);
//   for (let i = 1; i <= n_fechas; ++i) {
//     currentDate.setDate(currentDate.getDate() + aumento);
//     tbodyDate.innerHTML += `<tr><td style="font-size: 15px;">${currentDate.getDate()}/${
//       currentDate.getMonth() + 1
//     }/${currentDate.getFullYear()}</td></tr>`;
//   }
// }

// ---------- functions -------------

selectMachine.onchange = async function () {
  const machine = selectMachine.value;

  if (machine === "") return;

  const options = selectMachine.options;
  const res = await dbMantenimient.getPlan_id(
    options[options.selectedIndex].id
  );

  dateStart.value = res[0].date_start;
  selectorFre.value = res[0].frecuencia;

  setTable(res[0].date_start, res[0].frecuencia);
};
