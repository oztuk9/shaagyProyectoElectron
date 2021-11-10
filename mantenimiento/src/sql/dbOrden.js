const { getConnection } = require("../database");

// ---------- actions ---------------------

// inserta orden
async function registerOrden(data) {
  try {
    const conn = await getConnection();
    await conn.query("INSERT INTO orden SET ?", data);
  } catch (e) {
    console.log(e);
  }
}

// delete plan
async function deleteOrden(id) {
  const sql = `DELETE FROM orden WHERE id_orden IN (${id.join(",")})`;

  try {
    const conn = await getConnection();
    const result = await conn.query(sql);
    return result;
  } catch (e) {
    console.log(e);
  }
}

// update
async function updateOrden(id, data) {
  try {
    const conn = await getConnection();
    const result = await conn.query("UPDATE orden SET ? WHERE id_orden = ?", [
      data,
      id,
    ]);
    return result;
  } catch (e) {
    console.log(e);
  }
}

// --------- getters ----------------------

// get number of orden
async function getLastId() {
  try {
    const conn = await getConnection();
    const result = await conn.query(
      "SELECT id_orden FROM orden ORDER BY id_orden DESC LIMIT 1"
    );
    return result;
  } catch (e) {
    console.log(e);
  }
}

// get orden
async function getOrden() {
  try {
    const conn = await getConnection();
    const res = await conn.query(
      "SELECT id_orden, DATE_FORMAT( fecha, '%d-%m-%Y') as fecha, maquina, responsable, costo FROM orden ORDER BY id_orden DESC"
    );
    return res;
  } catch (e) {
    console.log(e);
  }
}

// get orden_id
async function getOrden_id(id) {
  try {
    const conn = await getConnection();
    const res = await conn.query(
      "SELECT DATE_FORMAT( fecha, '%Y-%m-%d') as fecha, actividades, repuestos, costo FROM orden WHERE id_orden = ?",
      [id]
    );
    return res;
  } catch (e) {
    console.log(e);
  }
}

// get fechas de mantenimiento
async function getDatesOrden(machine) {
  try {
    const conn = await getConnection();
    const res = await conn.query(
      "SELECT DATE_FORMAT( fecha, '%Y-%m-%d') as fecha FROM orden WHERE maquina = ?",
      [machine]
    );
    return res;
  } catch (e) {
    console.log(e);
  }
}

// search
async function searchOrden(find) {
  try {
    const conn = await getConnection();
    const result = await conn.query("CALL `search_orden`( ? )", [find]);
    return result;
  } catch (e) {
    console.log(e);
  }
}

module.exports = {
  registerOrden,
  deleteOrden,
  getLastId,
  getOrden,
  getOrden_id,
  getDatesOrden,
  searchOrden,
  updateOrden,
};
