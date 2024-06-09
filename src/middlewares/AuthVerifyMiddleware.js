const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    let token = req.headers['token'] || req.cookies['token'];
    
    if (!token) {
        return res.status(401).json({ status: "Unauthorized", message: "No token provided." });
    }
    
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ status: "Unauthorized", message: "Failed to authenticate token." });
        } else {
            const email = decoded.data.email;
            const user_id = decoded.data.user_id;
            const mobile=decoded.data.mobile;
            req.headers.email = email;
            req.headers.user_id = user_id;
            req.headers.mobile=mobile;
            
            next();
        }
    });
};
