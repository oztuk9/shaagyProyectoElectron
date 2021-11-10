const yup = require("yup");
const swal = require("sweetalert2");
const dbMantenimient = require("../sql/dbMantenimient.js");
const dbMachine = require("../sql/dbMachine.js");
const dbUser = require("../sql/dbUser.js");

// --------- elements---------------
// modal
const btnPDF = document.getElementById("btnPDF");
const modalPDF = document.getElementById("modalPDF");
const modalContainer = document.getElementById("modalContainer");
const modalName = document.getElementById("modalFileName");
const btnCloseModal = document.getElementById("closeModal");

// form
const formMant = document.getElementById("form-mant");
const dateStart = document.getElementById("dateStart");
const selectMachine = document.getElementById("selectorMachine");
const selectRes = document.getElementById("selectorRes");
const selectFre = document.getElementById("selectorFrecuencia");
const txtActivities = document.getElementById("txtActivities");
const inputFile = document.getElementById("inputPDF");
const btnFile = document.getElementById("btnFile");
const btnSubmit = document.getElementById("submit");
let fileBytes, fileName;

// table mantenimiento
const btnDelete = document.getElementById("btn-delete");
const txtSearch = document.getElementById("search");
const selectAll = document.getElementById("checkall");
const tbody = document.getElementById("tbodyMant");
let arrChecked = [];
let rowSelected; // tr element
let editStatus = false;

// table next date
const tbodyDate = document.getElementById("tbodyDate");

// ---------- DOM is loaded and ready ---------------

document.addEventListener("DOMContentLoaded", async (e) => {
  let res;
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
  fileName = "";
  fileBytes = "";
  btnPDF.style = "display: none";

  dbMantenimient.getPlan().then((res) => {
    setTable(res);
  });
}

// data table
function setTable(dataRow) {
  tbody.innerHTML = ""; // reset data

  dataRow.forEach((e) => {
    tbody.innerHTML += `<tr id=${e.id_plan}>
    <td style="width: 30px">
      <input type='checkbox' name="checkInput" id=${e.id_plan} class='checkbox' />
    </td>
    <td>${e.maquina}</td>
    <td>${e.frecuencia}</td>
    <td>${e.responsable}</td>
    <td class="tdFileName">${e.nombreArchivo}</td>
    </tr>`;
  });
}

// table next date
function setTableDate(date, frecuencia) {
  tbodyDate.innerHTML = "";

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

  var currentDate = new Date(date);
  for (let i = 1; i <= n_fechas; ++i) {
    currentDate.setDate(currentDate.getDate() + aumento);
    tbodyDate.innerHTML += `<tr><td style="font-size: 15px;">${currentDate.getDate()}/${
      currentDate.getMonth() + 1
    }/${currentDate.getFullYear()}</td></tr>`;
  }
}

// ---------- actions ---------------

// open the modal
btnPDF.onclick = function () {
  var pdfAsDataUri = `data:application/pdf;base64,${fileBytes}`;

  modalName.innerText = fileName;
  modalContainer.innerHTML = "";
  modalContainer.innerHTML = `<embed src="${pdfAsDataUri}" frameborder="0" width="100%" height="93%">`;
  modalPDF.style.display = "block";
};

// close the modal
btnCloseModal.onclick = function () {
  modalPDF.style.display = "none";
};

// get clicked row
tbody.onclick = (e) => {
  for (let i = 0; i < e.path.length; ++i) {
    if (e.path[i].tagName == "TR") {
      selectRow(e.path[i]);
      break;
    }
  }
};

btnFile.addEventListener("click", () => {
  inputFile.click();
});

btnDelete.onclick = () => {
  checkboxes = document.getElementsByName("checkInput");

  checkboxes.forEach((e) => {
    if (e.checked) arrChecked.push(e.id);
  });

  if (!arrChecked.length) return;

  dbMantenimient.deletePlan(arrChecked).then((res) => {
    swal.fire({
      toast: true,
      icon: "success",
      title: "plan eliminado",
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

// search user
txtSearch.addEventListener("input", () => {
  let timer = null; // tiempo en consultas

  try {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (txtSearch.value == "") return loadTable();

      dbMantenimient.searchPlan(txtSearch.value).then((res) => {
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

inputFile.addEventListener("change", async () => {
  if (inputFile.value === "") return;

  fileName = inputFile.files[0].name;
  fileBytes = await fileToByteArray(inputFile.files[0]);
});

// ---------- functions -------------

// validacion de datos
function validateMan(data) {
  const validationForm = yup.object().shape({
    date_start: yup
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
    frecuencia: yup
      .string()
      .required("frecuencia es requerido")
      .max(80, "maquina maximo 80 caracteres"),
    actividades: yup.string().max(30000, "actividades maximo 30000 caracteres"),
    nombreArchivo: yup
      .string()
      .max(240, "nombre del archivo maximo 240 caracteres"),
    archivo: yup.string(),
  });

  try {
    validationForm.validateSync(data);

    editStatus
      ? dbMantenimient.updatePlan(rowSelected.id, data)
      : dbMantenimient.registerPlan(data);

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

// convierte el archivo en bytes
function fileToByteArray(file) {
  var reader = new FileReader();
  reader.readAsDataURL(file);

  return new Promise((res, reject) => {
    reader.onload = function () {
      var comma = this.result.indexOf(",");
      var base64 = this.result.substr(comma + 1);
      res(base64);
    };
  });
}

// highlight row
function selectRow(r) {
  if (rowSelected !== undefined) rowSelected.style.backgroundColor = "white";

  rowSelected = r;
  rowSelected.style.backgroundColor = "#F8FAFD";
  previewDataRow(rowSelected);
}

async function previewDataRow(row) {
  selectMachine.value = row.cells[1].innerText;
  selectFre.value = row.cells[2].innerText;
  selectRes.value = row.cells[3].innerText;
  fileName = row.cells[4].innerText;

  const res = await dbMantenimient.getPlan_id(rowSelected.id);
  dateStart.value = res[0].date_start;
  txtActivities.value = res[0].actividades;
  fileBytes = res[0].archivo;
  setTableDate(res[0].date_start, row.cells[2].innerText);

  editStatus = true;
  btnPDF.style = "display: true";
  btnSubmit.innerHTML = "Guardar";
}

// --------- getData ----------------

// form data
formMant.addEventListener("submit", (e) => {
  e.preventDefault(); // evita el envio del form al iniciar

  // get values
  const newMant = {
    date_start: dateStart.value,
    maquina: selectMachine.value,
    responsable: selectRes.value,
    frecuencia: selectFre.value,
    actividades: txtActivities.value,
    nombreArchivo: fileName,
    archivo: fileBytes,
  };

  if (!validateMan(newMant)) return;

  swal.fire({
    toast: "true",
    icon: "success",
    title: editStatus ? "Cambios realizados" : "Plan agregado!",
    showConfirmButton: false,
    timer: 1500,
    position: "top-right",
  });

  // reset inputs
  formMant.reset();
  editStatus = false;
  btnSubmit.innerHTML = "Agregar";
  loadTable(); // refresh
});
