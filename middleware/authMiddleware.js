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

///////////////////////////////////
// This is a standard middleware function that checks for a JWT token in the request cookies or headers.
//  If a token is found, it verifies the token using the secret key and attaches the decoded user information to the request object.
//  If no token is provided or if the token is invalid or expired, it responds with an appropriate error message.
///////////////////////////////////

export const authMiddleware = (req, res, next) => {
    try {
        ///get authorization header
        const authHeader = req.headers.authorization;

        ////Check if user exists
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided."
            });
        }
        // Example:
        // Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
        const parts = authHeader.split(' ');
        // check if it has two parts and the first part is "Bearer"
        if (parts.length !== 2 || parts[0] !== "Bearer") {
            return res.status(401).json({
                success: false,
                message: "Access denied. Invalid token format."
            });
        }

        /// get the token from the second part
        const token = parts[1];

        //verify the token using jwt.verify

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // attach the decoded user information to the request object
        req.user = decoded;

        next();

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Invalid or expired token"
        })
    }

}

/////// authMiddleware that uses cookies instead of headers

export const authMiddlewareCookie = (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).josn({
                success: false,
                message: "Access denied. No token provided."
            });
        }

        //verify the token using jwt.verify

        const decode = jwt.verify(token, process.env.JWT_SECRET);

        // attach the decoded user information to the request object
        req.user = decode;

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
}