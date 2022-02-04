const express = require("express");
const logic = require("../business-logic-layer/logic");
const fileUpload = require("express-fileupload");
const userModel = require("../model/user-model");
const Credentials = require("../model/credentials");
const verifyLoggedIn = require("../middleware/verify-logged-in");
const verifyAdmin = require("../middleware/verify-admin");
const path = require("path");
const router = express.Router();
router.use(fileUpload());

router.get("/currencies/all", async (request, response) => {
  try {
    const currencies = await logic.getAllCurrencies();
    if (currencies.length >= 1) response.send(currencies);
    else response.status(404).send(`Can not find currencies`);
  } catch (error) {
    response.status(500).send(error);
  }
});


// allows the client to use images :

router.get("/images/:imageName", (request, response) => {
  try {
    // Data:
    const imageName = request.params.imageName;
    // Logic:
    let imageFile = path.join(__dirname, "..", "images", imageName);
    // Success:
    response.sendFile(imageFile);
  } catch (err) {
    response.status(500).send(err.message);
    console.log(err);
  }
});


// returns result and currency rate accordingly :

router.get("/:from_currency/:amount/:to_currency", verifyLoggedIn ,
  async (request, response) => {
    const curTypeToConvert = request.params.from_currency;
    const amount = request.params.amount;
    const to_currency = request.params.to_currency;
    try {
      const request = require("request-promise");
      request(
        `https://freecurrencyapi.net/api/v2/latest?apikey=1290edd0-8377-11ec-b0f4-6b14c8a43ebc&base_currency=${curTypeToConvert}`
      )
        .then((dataObj) => {
          const obj = JSON.parse(dataObj);
          const rate = obj.data[to_currency];
          const result = amount * rate;
          response.json({ rate: rate.toFixed(3), result: result.toFixed(3) });
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
      response.status(500).send(error);
    }
  }
);

router.get("/users/all", async (request, response) => {
  try {
    const users = await logic.getAllUsers();
    if (users.length >= 1) response.send(users);
    else response.status(404).send(`Can not find users`);
  } catch (error) {
    response.status(500).send(error);
  }
});

router.post("/login", async (request, response) => {
  try {
    // Data:
    const credentials = new Credentials(request.body);
    // Validation:
    const errors = credentials.validate();
    if (errors) return response.status(400).send(errors);

    // logic:
    const loggedInUser = await logic.loginAsync(credentials);
    console.log(loggedInUser);
    if (!loggedInUser)
      return response.status(401).send("Incorrect username or password.");

    // Success:
    response.json(loggedInUser);
  } catch (err) {
    console.log(err);
    response.status(500).send("Server error");
  }
});

// creating user if registered properly :

router.post("/user", async (request, response) => {
  const user = new userModel(request.body);
  const errors = user.validate();
  if (errors) {
    response.status(400).json(errors);
  } else {
    try {
      console.log(errors);
      await logic.addSingleUserAsync(user);
      response.status(201).send("Created"); // Created
    } catch (error) {
      console.log(error);
      response.status(500).send("Server error");
    }
  }
});

// adding currency (only admin) :

router.post(
  "/add/currency",
  [verifyLoggedIn, verifyAdmin],
  async (request, response) => {
    try {
      const currencyName = request.body.currencyName;
      const image = request.files?.image;
      const absolutePath = path.join(__dirname, "..", "images", image?.name);
      await image.mv(absolutePath); // mv = move
      await logic.addSingleCurrencyAsync(image?.name,currencyName);
      response.status(201).send("Created"); // Created
    } catch (error) {
      console.log(error);
      response.status(500).send("Server error");
    }
  }
);

module.exports = router;
