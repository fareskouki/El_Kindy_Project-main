import jwt from 'jsonwebtoken';

export const verifyToken = async (req, res, next) => {
    try {
        let token = req.header("Authorization");

        if (!token) {
           // console.log("Access denied !");
            return res.status(401).send("Access denied !");
        }

        if (token.startsWith("Bearer ")) {
            token = token.slice(7,token.length).trimLeft();
        } 

        // Decode the token to get the expiration time
        const decodedToken = jwt.decode(token);

        // Check if the token is expired
        if (decodedToken && decodedToken.exp && Date.now() >= decodedToken.exp * 1000) {
            //console.log("Token expired!");
            return res.status(403).send("Token expired !");
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();

    }catch (err) {
        res.status(500).json({ error: err.message });
    }
}


export const verifyRoles = (requiredRoles) => (req, res, next) => {
    if (!requiredRoles || !Array.isArray(requiredRoles)) {
        return res.status(500).json({ error: "Invalid roles provided." });
    }

    // Extract user roles from the token
    const userRoles = req.user.roles || [];

    // Check if user has any of the required roles
    const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
    if (!hasRequiredRole) {
        return res.status(401).send(`Access denied! Required roles: ${requiredRoles.join(', ')}`);
    }

    next();
};