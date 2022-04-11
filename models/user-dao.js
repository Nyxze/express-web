const { DAO } = require('./dao');
const userDAO = new DAO('users');

userDAO.checkIfEmailIsUnique = async (email) => {


    let sql = "SELECT EXISTS(SELECT id FROM users WHERE email=?)"
    const data = await userDAO.query(sql, [email]);
    // console.log)
    if (Object.values(data[0][0]) == 1) {
        return true
    } else {

        return false;
    }

}
module.exports = userDAO;