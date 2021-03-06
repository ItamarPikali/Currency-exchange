const jwt = require("jsonwebtoken");

function verifyLoggedIn(request, response, next) {
    // authorization header?
    if (!request.headers.authorization) 
        return response.status(401).send("You are not logged-in.");
    // Get token
    const token = request.headers.authorization.split(" ")[1];
    if (!token) return response.status(401).send("You are not logged-in.");
    // not sharing too much for secure code
    jwt.verify(token, "welcome to Itamar`s currencies site", (err,decodedToken) => {
        if (err) {
            if (err.message === "jwt expired") 
                return response.status(403).send("Your login session has expired. please login again");
            return response.status(401).send("You are not logged-in.");
        }
        else {
            request.user = decodedToken.user;
            next();
        }
    });
}

module.exports = verifyLoggedIn;