const { getConnection } = require("../database");

// ********** consultas mysql **************

// inserta usuario
async function registerUser(data) {
  try {
    const conn = await getConnection();
    await conn.query("INSERT INTO usuario SET ?", data);
  } catch (e) {
    console.log(e);
  }
}

// get users
async function getUsers() {
  try {
    const conn = await getConnection();
    const result = await conn.query(
      "SELECT * FROM usuario ORDER BY id_user DESC"
    );
    return result;
  } catch (e) {
    console.log(e);
  }
}

// update user
async function updateUser(id, data) {
  try {
    const conn = await getConnection();
    const result = await conn.query("UPDATE usuario SET ? WHERE id_user = ?", [
      data,
      id,
    ]);
    return result;
  } catch (e) {
    console.log(e);
  }
}

// search user
async function searchUser(find) {
  try {
    const conn = await getConnection();
    const result = await conn.query("CALL `search_user`( ? )", [find]);
    return result;
  } catch (e) {
    console.log(e);
  }
}

// delete user
async function deleteUser(id) {
  const sql = `DELETE FROM usuario WHERE id_user IN (${id.join(",")})`;

  try {
    const conn = await getConnection();
    const result = await conn.query(sql);
    return result;
  } catch (e) {
    console.log(e);
  }
}

module.exports = {
  registerUser,
  getUsers,
  updateUser,
  searchUser,
  deleteUser,
};
