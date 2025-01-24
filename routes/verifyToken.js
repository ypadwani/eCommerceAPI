const jwt = require("jsonwebtoken");

// Middleware to verify the token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token; // Token should be passed in headers
    if (authHeader) {
        const token = authHeader.split(" ")[1]; // Extract token after "Bearer "
        jwt.verify(token, process.env.JWT_SEC, (err, user) => { // Fix typo here
            if (err) return res.status(403).json("Token is not valid!"); // Handle invalid token
            req.user = user; // Attach user to the request
            next(); // Proceed to the next middleware
        });
    } else {
        return res.status(401).json("You are not authenticated!"); // No token provided
    }
};

// Middleware to verify token and user authorization
const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) { 
            next(); // User is authorized, proceed
        } else {
            res.status(403).json("You are not allowed to do that!"); // Forbidden action
        }
    });
};

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) { 
            next(); // User is authorized, proceed
        } else {
            res.status(403).json("You are not allowed to do that!"); // Forbidden action
        }
    });
};

module.exports = { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin };
