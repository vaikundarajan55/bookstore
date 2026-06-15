import jwt from "jsonwebtoken";

// Generate JWT token
export const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Verify JWT token
export const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};
