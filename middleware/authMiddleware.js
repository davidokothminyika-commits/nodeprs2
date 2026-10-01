import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    //check cookie first
    let token = req.cookies?.token;

    if (!token && req.headers.authorization?.startswith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(400).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};