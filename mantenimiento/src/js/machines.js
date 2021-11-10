const yup = require("yup");
const swal = require("sweetalert2");
const dbMachine = require("../sql/dbMachine.js");

// modal area elements
const btnArea = document.getElementById("btn-area");
const tbodyArea = document.getElementById("tbody-area");
const submitArea = document.getElementById("submit-area");
const txtArea = document.getElementById("txt-area");
const modal = document.getElementsByClassName("modal");
const btnDeleteArea = document.getElementById("btn-delete-area");
const searchArea = document.getElementById("search-area");
const selectAllArea = document.getElementById("checkall-area");
const selectorArea = document.getElementById("selector-area");
let span = document.getElementsByClassName("close"); // Get the <span> element that closes the modal
let arrCheckedArea = [];
let rowArea;

// modal subarea elements
const btnSub = document.getElementById("btn-sub");
const tbodySub = document.getElementById("tbody-sub");
const submitSub = document.getElementById("submit-sub");
const txtSub = document.getElementById("txt-sub");
const btnDeleteSub = document.getElementById("btn-delete-sub");
const searchSub = document.getElementById("search-sub");
const selectAllSub = document.getElementById("checkall-sub");
const selectorSub = document.getElementById("selector-sub");
const selectorAreaSub = document.getElementById("selector-inSubarea");
let rowSub;
let arrCheckedSub = [];

// image
const image = document.getElementById("image");
const inputImage = document.getElementById("inputImage");
const txtName = document.getElementById("name");
const txtCode = document.getElementById("code");
const txtModel = document.getElementById("model");
const txtSerie = document.getElementById("n_serie");
const txtBrand = document.getElementById("brand");
const txtDescription = document.getElementById("description");
const btnSubmit = document.getElementById("submit");
const tbody = document.getElementById("tbody");
const selectAll = document.getElementById("checkall");
const btnDelete = document.getElementById("btn-delete");
const txtSearch = document.getElementById("search");
let rowSelected = undefined;
let arrChecked = [];
let editStatus = false;

// event change input avatar
inputImage.addEventListener("change", () => {
  // validation image
  if (inputImage.files[0] === undefined) return;
  if (inputImage.files[0].size > 1200000) {
    inputImage.value = "";

    return swal.fire({
      toast: true,
      icon: "error",
      title: "La imagen es muy grande",
      position: "top-right",
    });
  }

  const reader = new FileReader();
  reader.readAsDataURL(inputImage.files[0]);

  reader.onload = (e) => {
    image.src = e.target.result;
  };
});

// get image
function getImage() {
  if (editStatus) return image.src;

  return inputImage.files[0] !== undefined
    ? image.src
    : "./../assets/emptyTv.svg";
}

// load table
function loadTable() {
  rowSelected = undefined;
  arrChecked = [];
  editStatus = false;

  dbMachine.getMachines().then((res) => {
    setTable(res);
  });
}

// search machine
txtSearch.addEventListener("input", () => {
  let timer = null; // tiempo en consultas

  try {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (txtSearch.value == "") return loadTable();

      dbMachine.searchMachine(txtSearch.value).then((res) => {
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

btnDelete.onclick = () => {
  checkboxes = document.getElementsByName("checkInput");

  checkboxes.forEach((e) => {
    if (e.checked) arrChecked.push(e.id);
  });

  if (!arrChecked.length) return;

  dbMachine.deleteMachine(arrChecked).then((res) => {
    swal.fire({
      toast: true,
      icon: "success",
      title: "machina eliminada",
      position: "top-right",
    });
    loadTable();
  });
};

// set data table
function setTable(dataRow) {
  tbody.innerHTML = ""; // reset data

  dataRow.forEach((e) => {
    tbody.innerHTML += `<tr id=${e.id_maquina}>
    <td style="width: 30px">
      <input type='checkbox' name="checkInput" id=${e.id_maquina} class='checkbox' />
    </td>
    <td>
      <div class="tb-name">
        <img class="tb-photo" src="${e.photo}"/>
        ${e.name}
      </div>
    </td>
    <td>${e.code}</td>
    <td>${e.model}</td>
    <td>${e.serie}</td>
    <td>${e.brand}</td>
    <td class="tdDescription" style="display: none;">${e.description}</td>
    <td>${e.area}</td>
    <td>${e.subarea}</td></tr>`;
  });
}

// validacion de datos
function validateMachine(data) {
  const validationForm = yup.object().shape({
    area: yup.string().required("area es requerida"),
    subarea: yup.string().required("subarea es requerida"),
    name: yup
      .string()
      .required("nombre es requerido")
      .max(180, "nombre: demasiado largo maximo 180 caracteres"),
    code: yup.string().max(30, "codigo: demasiado largo maximo 30 caracteres"),
    model: yup.string().max(80, "modelo: demasiado largo maximo 80 caracteres"),
    serie: yup
      .string()
      .max(20, "n_serie: demasiado largo maximo 20 caracteres"),
    brand: yup.string().max(50, "marca: demasiado largo maximo 50 caracteres"),
    description: yup
      .string()
      .max(1500, "describcion: demasiado larga maximo 1500 caracteres"),
  });

  try {
    validationForm.validateSync(data);

    editStatus
      ? dbMachine.updateMachine(rowSelected.id, data)
      : dbMachine.registerMachine(data);

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

// submit event
const formMachine = document.getElementById("form-machine");
formMachine.addEventListener("submit", (e) => {
  e.preventDefault(); // evita el envio del form al iniciar

  // get values
  const newMachine = {
    photo: getImage(),
    area: selectorArea.value,
    subarea: selectorSub.value,
    name: txtName.value,
    code: txtCode.value,
    model: txtModel.value,
    serie: txtSerie.value,
    brand: txtBrand.value,
    description: txtDescription.value,
  };

  if (!validateMachine(newMachine)) return;

  swal.fire({
    toast: "true",
    icon: "success",
    title: editStatus ? "Cambios realizados" : "Maquina agregada!",
    showConfirmButton: false,
    timer: 1500,
    position: "top-right",
  });

  // reset inputs
  formMachine.reset();
  image.src = "./../assets/tv.svg";
  editStatus = false;
  btnSubmit.innerHTML = "Agregar";
  loadTable(); // refresh
});

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

// get clicked row
tbody.onclick = (e) => {
  for (let i = 0; i < e.path.length; ++i) {
    if (e.path[i].tagName == "TR") {
      selectRow(e.path[i]);
      break;
    }
  }
};

// highlight row
function selectRow(r) {
  if (rowSelected !== undefined) rowSelected.style.backgroundColor = "white";

  rowSelected = r;
  rowSelected.style.backgroundColor = "#F8FAFD";
  previewDataRow(rowSelected);
}

function previewDataRow(row) {
  txtName.value = row.cells[1].innerText;
  txtCode.value = row.cells[2].innerText;
  txtModel.value = row.cells[3].innerText;
  txtBrand.value = row.cells[3].innerText;
  txtSerie.value = row.cells[4].innerText;
  txtBrand.value = row.cells[5].innerText;
  txtDescription.value = row.cells[6].innerText;
  image.src = row.cells[1].getElementsByClassName("tb-photo")[0].src;
  selectorArea.value = row.cells[7].innerText;

  editStatus = true;
  btnSubmit.innerHTML = "Guardar";
}

// When the user clicks the button, open the modal
btnArea.onclick = function () {
  modal[0].style.display = "block";
};

btnSub.onclick = async () => {
  modal[1].style.display = "block";

  const res = await dbMachine.getLastArea();
  dbMachine.getSub(res[0].id_area).then((res) => {
    setTableSub(res);
  });
};
// When the user clicks on <span> (x), close the modal
span[0].onclick = function () {
  modal[0].style.display = "none";
};

span[1].onclick = function () {
  modal[1].style.display = "none";
};
// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

// Your code to run since DOM is loaded and ready
document.addEventListener("DOMContentLoaded", (e) => {
  loadArea();
  loadSub();
  loadTable();
});

function loadPickerArea(dataRow) {
  selectorArea.innerHTML = "";

  dataRow.forEach((e) => {
    selectorArea.innerHTML += `<option id='${e.id_area}'>${e.name}</option>`;
  });
  selectorAreaSub.innerHTML = selectorArea.innerHTML;
}

function loadArea() {
  (arrCheckedArea = []),
    (rowArea = undefined),
    dbMachine.getArea().then((res) => {
      loadPickerArea(res);
      setTableArea(res);
    });
}

function setTableArea(dataRow) {
  tbodyArea.innerHTML = ""; // reset data

  dataRow.forEach((e) => {
    tbodyArea.innerHTML += `<tr id=${e.id_area}>
    <td style="width: 0px">
      <input type='checkbox' name="checkInputArea" id=${e.id_area} class='checkbox' />
    </td>
    <td style="color: rgb(53, 53, 53);">${e.name}</td>`;
  });
}

// validacion de datos
function validateArea(data) {
  const validationForm = yup.object().shape({
    name: yup
      .string()
      .required("area es requerido")
      .min(1, "area: debe tener minimo 1 caracteres")
      .max(180, "area: demasiado largo maximo 180 caracteres"),
  });

  try {
    validationForm.validateSync(data);
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

// get data area
submitArea.addEventListener("click", () => {
  const newArea = { name: txtArea.value };
  if (!validateArea(newArea)) return; // validamos nombre

  dbMachine.registerArea(newArea);

  swal.fire({
    toast: "true",
    icon: "success",
    title: "Area agregada!",
    showConfirmButton: false,
    timer: 1500,
    position: "top-right",
  });

  txtArea.value = "";
  loadArea();
});

// get clicked row
tbodyArea.onclick = (e) => {
  for (let i = 0; i < e.path.length; ++i) {
    if (e.path[i].tagName == "TR") {
      if (rowArea !== undefined) rowArea.style.backgroundColor = "white";

      rowArea = e.path[i];
      rowArea.style.backgroundColor = "#F8FAFD";
      break;
    }
  }
};

selectAllArea.onclick = () => {
  checkboxes = document.getElementsByName("checkInputArea");

  if (selectAllArea.checked)
    checkboxes.forEach((e) => {
      e.checked = true;
    });
  else
    checkboxes.forEach((e) => {
      e.checked = false;
    });
};

btnDeleteArea.addEventListener("click", () => {
  checkboxes = document.getElementsByName("checkInputArea");

  checkboxes.forEach((e) => {
    if (e.checked) arrCheckedArea.push(e.id);
  });

  if (!arrCheckedArea.length) return;

  dbMachine.deleteArea(arrCheckedArea).then((res) => {
    swal.fire({
      toast: true,
      icon: "success",
      title: "area eliminada",
      position: "top-right",
    });
    loadArea();
  });
});

// search user
searchArea.addEventListener("input", () => {
  let timer = null; // tiempo en consultas

  try {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (searchArea.value == "") return loadArea();

      dbMachine.searchArea(searchArea.value).then((res) => {
        setTableArea(res[0]);
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

// ------------------ subarea

function loadPickerSub(dataRow) {
  selectorSub.innerHTML = "";

  dataRow.forEach((e) => {
    selectorSub.innerHTML += `<option id='${e.id_subarea}'>${e.name}</option>`;
  });
}

async function loadSub(id) {
  (arrCheckedSub = []), (rowSub = undefined);

  const res = await dbMachine.getLastArea();

  if (id === undefined)
    dbMachine.getSub(res[0].id_area).then((res) => {
      loadPickerSub(res);
      setTableSub(res);
    });
  else
    dbMachine.getSub(id).then((res) => {
      loadPickerSub(res);
      setTableSub(res);
    });
}

selectorArea.addEventListener("change", (e) => {
  dbMachine.getSub(selectorArea[selectorArea.selectedIndex].id).then((res) => {
    loadPickerSub(res);
  });
});

function setTableSub(dataRow) {
  tbodySub.innerHTML = ""; // reset data

  dataRow.forEach((e) => {
    tbodySub.innerHTML += `<tr id=${e.id_subarea}>
    <td style="width: 0px">
      <input type='checkbox' name="checkInputSub" id=${e.id_subarea} class='checkbox' />
    </td>
    <td style="color: rgb(53, 53, 53);">${e.name}</td>`;
  });
}

// validacion de datos
function validateSub(data) {
  const validationForm = yup.object().shape({
    name: yup
      .string()
      .required("subarea es requerido")
      .min(1, "subarea: debe tener minimo 1 caracteres")
      .max(180, "subarea: demasiado largo maximo 180 caracteres"),
    fk_area: yup
      .string()
      .required("area es requerido")
      .min(1, "area: debe tener minimo 1 caracteres"),
  });

  try {
    validationForm.validateSync(data);
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

// get data area
submitSub.addEventListener("click", () => {
  const newSub = {
    fk_area: selectorAreaSub[selectorAreaSub.options.selectedIndex].id,
    name: txtSub.value,
  };
  if (!validateSub(newSub)) return; // validamos nombre

  dbMachine.registerSub(newSub);

  swal.fire({
    toast: "true",
    icon: "success",
    title: "Subarea agregada!",
    showConfirmButton: false,
    timer: 1500,
    position: "top-right",
  });

  txtSub.value = "";
  loadSub(selectorAreaSub[selectorAreaSub.selectedIndex].id);
});

// get clicked row
tbodySub.onclick = (e) => {
  for (let i = 0; i < e.path.length; ++i) {
    if (e.path[i].tagName == "TR") {
      if (rowSub !== undefined) rowSub.style.backgroundColor = "white";

      rowSub = e.path[i];
      rowSub.style.backgroundColor = "#F8FAFD";
      break;
    }
  }
};

selectAllSub.onclick = () => {
  checkboxes = document.getElementsByName("checkInputSub");

  if (selectAllSub.checked)
    checkboxes.forEach((e) => {
      e.checked = true;
    });
  else
    checkboxes.forEach((e) => {
      e.checked = false;
    });
};

btnDeleteSub.addEventListener("click", () => {
  checkboxes = document.getElementsByName("checkInputSub");

  checkboxes.forEach((e) => {
    if (e.checked) arrCheckedSub.push(e.id);
  });

  if (!arrCheckedSub.length) return;

  dbMachine.deleteSub(arrCheckedSub).then((res) => {
    swal.fire({
      toast: true,
      icon: "success",
      title: "area eliminada",
      position: "top-right",
    });
    loadSub(selectorAreaSub[selectorAreaSub.selectedIndex].id);
  });
});

// search subarea
searchSub.addEventListener("input", () => {
  let timer = null; // tiempo en consultas

  try {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (searchSub.value == "") return loadSub();

      dbMachine.searchSub(searchSub.value).then((res) => {
        setTableSub(res[0]);
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

selectorAreaSub.addEventListener("change", () => {
  dbMachine
    .getSub(selectorAreaSub[selectorAreaSub.selectedIndex].id)
    .then((res) => {
      setTableSub(res);
    });
});

// event open input when press avatar
image.addEventListener("click", () => {
  inputImage.click();
});
