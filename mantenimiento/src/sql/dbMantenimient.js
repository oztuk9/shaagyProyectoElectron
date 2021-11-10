const { getConnection } = require("../database");

// inserta plan
async function registerPlan(data) {
  try {
    const conn = await getConnection();
    await conn.query("INSERT INTO plan_mantenimiento SET ?", data);
  } catch (e) {
    console.log(e);
  }
}

// get plan
async function getPlan(data) {
  try {
    const conn = await getConnection();
    const res = await conn.query(
      "SELECT id_plan, maquina, responsable, frecuencia, nombreArchivo FROM plan_mantenimiento ORDER BY id_plan DESC"
    );
    return res;
  } catch (e) {
    console.log(e);
  }
}

// get plan
async function getPlan_id(id) {
  try {
    const conn = await getConnection();
    const res = await conn.query(
      "SELECT DATE_FORMAT( date_start, '%Y-%m-%d') as date_start, actividades, CONVERT( archivo USING utf8) as archivo, frecuencia FROM plan_mantenimiento WHERE id_plan = ?",
      [id]
    );
    return res;
  } catch (e) {
    console.log(e);
  }
}

// delete plan
async function deletePlan(id) {
  const sql = `DELETE FROM plan_mantenimiento WHERE id_plan IN (${id.join(
    ","
  )})`;

  try {
    const conn = await getConnection();
    const result = await conn.query(sql);
    return result;
  } catch (e) {
    console.log(e);
  }
}

// search
async function searchPlan(find) {
  try {
    const conn = await getConnection();
    const result = await conn.query("CALL `search_plan`( ? )", [find]);
    return result;
  } catch (e) {
    console.log(e);
  }
}

// update
async function updatePlan(id, data) {
  try {
    const conn = await getConnection();
    const result = await conn.query(
      "UPDATE plan_mantenimiento SET ? WHERE id_plan = ?",
      [data, id]
    );
    return result;
  } catch (e) {
    console.log(e);
  }
}

module.exports = {
  registerPlan,
  getPlan,
  getPlan_id,
  deletePlan,
  searchPlan,
  updatePlan,
};
