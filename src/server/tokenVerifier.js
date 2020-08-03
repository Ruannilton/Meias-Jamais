const jwt = require("jsonwebtoken");

function tokenVerifier(req, res, next) {
    var str = req.headers["authorization"];

    if (!str)
        return res
            .status(401)
            .send({ auth: false, message: "No token provided." });

    var token = str.split(" ")[1];

    if (!token)
        return res
            .status(401)
            .send({ auth: false, message: "No token provided." });

    jwt.verify(token, "teste", function (err, decoded) {
        if (err) {
            return res.status(500).send({
                auth: false,
                message: "Failed to authenticate token.",
            });
        }
        req.id = decoded.id;
        next();
    });
}

module.exports = tokenVerifier;
