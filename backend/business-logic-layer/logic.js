const dal = require("../data-access-layer/dal");
const jwt = require("jsonwebtoken");

function getAllCurrencies() {
  return dal.executeQueryAsync("select * from currencies");
}

function getAllUsers() {
  return dal.executeQueryAsync("select * from users");
}

function addSingleUserAsync(user) {
  console.log(user);
  return dal.executeQueryAsync(
    `insert into users values
     (?,?,?,? )`, // preventing sql injection
    [user.chosenUserName, user.password, "", ""]
  );
}

async function loginAsync(credentials) {
  const user = await dal.executeQueryAsync(
    `
              select * from users 
              where username=?
              and password=?
          `,
    [credentials.username, credentials.password]
  );
  if (!user || user.length < 1) return null;
  delete user[0].password;
  user[0].token = jwt.sign(
    { user: user[0] },
    "welcome to Itamar`s currencies site",
    { expiresIn: "50 minutes" }
  );
  return user[0];
}

function addSingleCurrencyAsync(imageName, currencyName) {
  return dal.executeQueryAsync(
    `insert into currencies values
     (DEFAULT,?,?)`, // default for AI field
    [imageName,currencyName] // preventing sql injection
  );
}

module.exports = {
  getAllUsers,
  addSingleUserAsync,
  loginAsync,
  getAllCurrencies,
  addSingleCurrencyAsync,
};
