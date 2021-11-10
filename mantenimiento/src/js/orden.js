const yup = require("yup");
const swal = require("sweetalert2");
const dbMachine = require("../sql/dbMachine.js");
const dbUser = require("../sql/dbUser.js");
const dbOrden = require("../sql/dbOrden.js");

// --------- elements---------------
// form
const formOrden = document.getElementById("formOrden");
const labelOrden = document.getElementById("labelOrden");
const dateOrden = document.getElementById("dateOrden");
const selectMachine = document.getElementById("selectorMachine");
const selectRes = document.getElementById("selectorRes");
const txtActivities = document.getElementById("txtActividades");
const txtRepuestos = document.getElementById("txtRepuestos");
const txtCosto = document.getElementById("txtCosto");
const btnSubmit = document.getElementById("submit");

// table orden
const btnDelete = document.getElementById("btn-delete");
const txtSearch = document.getElementById("search");
const selectAll = document.getElementById("checkall");
const tbodyOrden = document.getElementById("tbodyOrden");
let arrChecked = [];
let rowSelected; // tr element
let editStatus = false;

// ---------- DOM is loaded and ready ---------------

document.addEventListener("DOMContentLoaded", async (e) => {
  let res;
  res = await dbOrden.getLastId();

  res = await dbMachine.getMachines();
  setSelector(selectMachine, res);

  res = await dbUser.getUsers();
  setSelector(selectRes, res);

  loadTable();
});

// ---------- setters ---------------

function setSelector(selector, data) {
  data.forEach((e) => {
    selector.innerHTML += `<option id='${e.id_maquina}'>${e.name}</option>`;
  });
}

// load table
function loadTable() {
  rowSelected = undefined;
  arrChecked = [];
  editStatus = false;

  dbOrden.getOrden().then((res) => {
    setTable(res);
  });
}

// data table
function setTable(dataRow) {
  tbodyOrden.innerHTML = ""; // reset data

  dataRow.forEach((e) => {
    tbodyOrden.innerHTML += `<tr id=${e.id_orden}>
      <td style="width: 30px">
        <input type='checkbox' name="checkInput" id=${e.id_orden} class='checkbox' />
      </td>
      <td style="color: black">${e.id_orden}</td>
      <td>${e.fecha}</td>
      <td>${e.maquina}</td>
      <td>${e.responsable}</td>
      <td>$${e.costo}</td>
      </tr>`;
  });
}

// ---------- actions ---------------

// get clicked row
tbodyOrden.onclick = (e) => {
  for (let i = 0; i < e.path.length; ++i) {
    if (e.path[i].tagName == "TR") {
      selectRow(e.path[i]);
      break;
    }
  }
};

btnDelete.onclick = () => {
  checkboxes = document.getElementsByName("checkInput");

  checkboxes.forEach((e) => {
    if (e.checked) arrChecked.push(e.id);
  });

  if (!arrChecked.length) return;

  dbOrden.deleteOrden(arrChecked).then((res) => {
    swal.fire({
      toast: true,
      icon: "success",
      title: "orden eliminada",
      position: "top-right",
    });
    loadTable();
  });
};

selectAll.onclick = () => {
  checkboxes = document.getElementsByName("checkInput");

  if (selectAll.checked)
    checkboxes.forEach((e) => {
      e.checked = true;
    });
  else
    checkboxes.forEach((e) => {
      e.checked = false;
    });
};

// search orden
txtSearch.addEventListener("input", () => {
  let timer = null; // tiempo en consultas

  try {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (txtSearch.value == "") return loadTable();

      dbOrden.searchOrden(txtSearch.value).then((res) => {
        setTable(res[0]);
      });
    }, 600);
  } catch (e) {
    swal.fire({
      toast: true,
      icon: "error",
      title: e.message,
      position: "top-right",
    });
    return false;
  }
});

// ---------- functions -------------

// validacion de datos
function validateOrden(data) {
  const validationForm = yup.object().shape({
    fecha: yup
      .date()
      .required("fecha es requerida")
      .typeError("fecha es requerida"),
    maquina: yup
      .string()
      .required("maquina es requerida")
      .max(200, "maquina maximo 200 caracteres"),
    responsable: yup
      .string()
      .required("responsable es requerido")
      .max(180, "maquina maximo 180 caracteres"),
    actividades: yup.string().max(30000, "actividades maximo 30000 caracteres"),
    respuestos: yup.string().max(30000, "repuestos maximo 30000 caracteres"),
    costo: yup
      .number()
      .required("costo requerido")
      .max(9999999, "costo demasiado elevado")
      .min(0, "costo invalido")
      .typeError("costo invalido"),
  });

  try {
    validationForm.validateSync(data);

    editStatus
      ? dbOrden.updateOrden(rowSelected.id, data)
      : dbOrden.registerOrden(data);

    return true;
  } catch (e) {
    swal.fire({
      toast: true,
      icon: "info",
      title: e.message,
      position: "top-right",
    });
    return false;
  }
}

// highlight row
function selectRow(r) {
  if (rowSelected !== undefined) rowSelected.style.backgroundColor = "white";

  rowSelected = r;
  rowSelected.style.backgroundColor = "#F8FAFD";
  previewDataRow(rowSelected);
}

async function previewDataRow(row) {
  labelOrden.innerText = row.cells[1].innerText;
  selectMachine.value = row.cells[3].innerText;
  selectRes.value = row.cells[4].innerText;

  const res = await dbOrden.getOrden_id(row.cells[1].innerText);
  dateOrden.value = res[0].fecha;
  txtActivities.value = res[0].actividades;
  txtRepuestos.value = res[0].repuestos;
  txtCosto.value = res[0].costo;

  editStatus = true;
  btnSubmit.innerHTML = "Guardar";
}

// --------- getData ----------------

// form data
formOrden.addEventListener("submit", (e) => {
  e.preventDefault(); // evita el envio del form al iniciar

  // get values
  const newOrden = {
    fecha: dateOrden.value,
    maquina: selectMachine.value,
    responsable: selectRes.value,
    actividades: txtActivities.value,
    repuestos: txtRepuestos.value,
    costo: txtCosto.value,
  };

  if (!validateOrden(newOrden)) return;

  swal.fire({
    toast: "true",
    icon: "success",
    title: editStatus ? "Cambios realizados" : "Orden registrada!",
    showConfirmButton: false,
    timer: 1500,
    position: "top-right",
  });

  // reset inputs
  formOrden.reset();
  editStatus = false;
  btnSubmit.innerHTML = "Agregar";
  loadTable(); // refresh
});
