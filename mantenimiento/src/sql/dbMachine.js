const { getConnection } = require("../database");

// ********** consultas mysql **************

// inserta area
async function registerArea(data) {
  try {
    const conn = await getConnection();
    await conn.query("INSERT INTO area SET ?", data);
  } catch (e) {
    console.log(e);
  }
}

// get area
async function getArea() {
  try {
    const conn = await getConnection();
    const res = await conn.query("SELECT * FROM area ORDER BY id_area DESC");
    return res;
  } catch (e) {
    console.log(e);
  }
}

// search area
async function searchArea(find) {
  try {
    const conn = await getConnection();
    const result = await conn.query("CALL `search_area`( ? )", [find]);
    return result;
  } catch (e) {
    console.log(e);
  }
}

// delete area
async function deleteArea(id) {
  const sql = `DELETE FROM area WHERE id_area IN (${id.join(",")})`;

  try {
    const conn = await getConnection();
    const result = await conn.query(sql);
    return result;
  } catch (e) {
    console.log(e);
  }
}

// inserta subarea
async function registerSub(data) {
  try {
    const conn = await getConnection();
    await conn.query("INSERT INTO subarea SET ?", data);
  } catch (e) {
    console.log(e);
  }
}

// get subarea
async function getSub() {
  try {
    const conn = await getConnection();
    const res = await conn.query(
      "SELECT * FROM subarea ORDER BY id_subarea DESC"
    );
    return res;
  } catch (e) {
    console.log(e);
  }
}

// get subarea depending on area
async function getSub(id_area) {
  try {
    const conn = await getConnection();
    const res = await conn.query(
      "SELECT * FROM subarea WHERE fk_area = ? ORDER BY id_subarea DESC",
      [id_area]
    );
    return res;
  } catch (e) {
    console.log(e);
  }
}

// search subarea
async function searchSub(find) {
  try {
    const conn = await getConnection();
    const result = await conn.query("CALL `search_subarea`( ? )", [find]);
    return result;
  } catch (e) {
    console.log(e);
  }
}

// delete area
async function deleteSub(id) {
  const sql = `DELETE FROM subarea WHERE id_subarea IN (${id.join(",")})`;

  try {
    const conn = await getConnection();
    const result = await conn.query(sql);
    return result;
  } catch (e) {
    console.log(e);
  }
}

// get area
async function getLastArea() {
  const sql = `SELECT id_area FROM area ORDER BY id_area DESC LIMIT 1`;

  try {
    const conn = await getConnection();
    const result = await conn.query(sql);
    return result;
  } catch (e) {
    console.log(e);
  }
}

// inserta maquina
async function registerMachine(data) {
  try {
    const conn = await getConnection();
    await conn.query("INSERT INTO maquina SET ?", data);
  } catch (e) {
    console.log(e);
  }
}

// get maquinas
async function getMachines() {
  try {
    const conn = await getConnection();
    const res = await conn.query(
      "SELECT * FROM maquina ORDER BY id_maquina DESC"
    );
    return res;
  } catch (e) {
    console.log(e);
  }
}

// update machine
async function updateMachine(id, data) {
  try {
    const conn = await getConnection();
    const result = await conn.query(
      "UPDATE maquina SET ? WHERE id_maquina = ?",
      [data, id]
    );
    return result;
  } catch (e) {
    console.log(e);
  }
}

// delete machine
async function deleteMachine(id) {
  const sql = `DELETE FROM maquina WHERE id_maquina IN (${id.join(",")})`;

  try {
    const conn = await getConnection();
    const result = await conn.query(sql);
    return result;
  } catch (e) {
    console.log(e);
  }
}

// search machine
async function searchMachine(find) {
  try {
    const conn = await getConnection();
    const result = await conn.query("CALL `search_maquina`( ? )", [find]);
    return result;
  } catch (e) {
    console.log(e);
  }
}

module.exports = {
  registerArea,
  getArea,
  searchArea,
  deleteArea,
  getLastArea,
  registerSub,
  getSub,
  searchSub,
  deleteSub,
  registerMachine,
  getMachines,
  updateMachine,
  deleteMachine,
  searchMachine,
};
