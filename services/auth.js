const JWT = require("jsonwebtoken");

function createTokenForUser(user){
    const secret = process.env.JWT_SECRET || "safespot$_secret_key";
    const payload = {
        _id:user._id,
        email:user.email,
        role:user.role,
    };
    const token = JWT.sign(payload,secret);
    return token;
}

function validateToken(token){
    const secret = process.env.JWT_SECRET || "safespot$_secret_key";
    const payload = JWT.verify(token,secret);
    return payload;
};

module.exports = {
    createTokenForUser,
    validateToken,
}