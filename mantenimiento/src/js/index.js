const yup = require("yup");
const swal = require("sweetalert2");
const regex = require("xregexp");
const dbUser = require("../sql/dbUser");

// get elements
const image = document.getElementById("image");
const inputImage = document.getElementById("inputImage");
const txtName = document.getElementById("name");
const txtCharge = document.getElementById("charge");
const txtPhone = document.getElementById("phone");
const txtCard = document.getElementById("card");
const btnSubmit = document.getElementById("submit");
const btnDelete = document.getElementById("btn-delete");

// table users
const txtSearch = document.getElementById("search");
const selectAll = document.getElementById("checkall");
const tbody = document.getElementById("tbody");
let arrChecked = [];
let rowSelected; // tr element
let editStatus = false; // when we like to change data from a user

// start page
document.addEventListener("DOMContentLoaded", (e) => {
  // Your code to run since DOM is loaded and ready
  loadTable();
});

// load table
function loadTable() {
  rowSelected = undefined;
  arrChecked = [];
  editStatus = false;

  dbUser.getUsers().then((res) => {
    setTable(res);
  });
}

// set data table
function setTable(dataRow) {
  tbody.innerHTML = ""; // reset data

  dataRow.forEach((e) => {
    tbody.innerHTML += `<tr id=${e.id_user}>
    <td style="width: 30px">
      <input type='checkbox' name="checkInput" id=${e.id_user} class='checkbox' />
    </td>
    <td>
      <div class="tb-name">
        <img class="tb-photo" src="${e.photo}"/>
        ${e.name}
      </div>
    </td>
    <td>${e.charge}</td>
    <td>${e.phone}</td>
    <td>${e.card}</td></tr>`;
  });
}

btnDelete.onclick = () => {
  checkboxes = document.getElementsByName("checkInput");

  checkboxes.forEach((e) => {
    if (e.checked) arrChecked.push(e.id);
  });

  if ( !arrChecked.length ) return;

  dbUser.deleteUser(arrChecked).then((res) => {
    swal.fire({
      toast: true,
      icon: "success",
      title: "usuario eliminado",
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
  txtCharge.value = row.cells[2].innerText;
  txtPhone.value = row.cells[3].innerText;
  txtCard.value = row.cells[4].innerText;
  image.src = row.cells[1].getElementsByClassName("tb-photo")[0].src;

  editStatus = true;
  btnSubmit.innerHTML = "Guardar";
}

// search user
txtSearch.addEventListener("input", () => {
  let timer = null; // tiempo en consultas

  try {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (txtSearch.value == "") return loadTable();

      dbUser.searchUser(txtSearch.value).then((res) => {
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

// validacion de datos
function validateUser(data) {
  const validationForm = yup.object().shape({
    name: yup
      .string()
      .required("nombre es requerido")
      .min(3, "nombre: debe tener minimo 3 caracteres")
      .max(40, "nombre: demasiado largo maximo 40 caracteres"),
    charge: yup
      .string()
      .required("cargo es requerido")
      .max(140, "cargo: demasiado largo maximo 40 caracteres"),
    phone: yup
      .string()
      .matches(/^(\d{0}|\d{10,})+$/, "telefono: minimo 10 digitos"),
    card: yup.string().matches(/^(\d{0}|\d{7,})+$/, "cedula: minimo 7 digitos"),
  });

  try {
    validationForm.validateSync(data);
    const unicode = regex("^([\\pL]+ )*([\\pL])+$");

    if (!unicode.test(data.name)) throw new Error("nombre: invalido");
    if (!unicode.test(data.charge)) throw new Error("cargo: invalido");

    editStatus
      ? dbUser.updateUser(rowSelected.id, data)
      : dbUser.registerUser(data);

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
const formUser = document.getElementById("form-user");
formUser.addEventListener("submit", (e) => {
  e.preventDefault(); // evita el envio del form al iniciar

  // get values
  const newUser = {
    photo: getImage(),
    name: txtName.value,
    charge: txtCharge.value,
    phone: txtPhone.value,
    card: txtCard.value,
  };

  if (!validateUser(newUser)) return;

  swal.fire({
    toast: "true",
    icon: "success",
    title: editStatus ? "Cambios realizados" : "Usuario agregado!",
    showConfirmButton: false,
    timer: 1500,
    position: "top-right",
  });

  // reset inputs
  formUser.reset();
  txtName.focus();
  image.src = "./../assets/profile.svg";
  editStatus = false;
  btnSubmit.innerHTML = "Agregar";
  loadTable(); // refresh
});

// event open input when press avatar
image.addEventListener("click", () => {
  inputImage.click();
});

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
    : "./../assets/emptyUser.svg";
}
