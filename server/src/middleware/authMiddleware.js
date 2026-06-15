import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token, unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: 'Access Denied'
        });
    }

    try {
         
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = {
            user_id: decoded.user_id,
            emp_email: decoded.emp_email,
            emp_name: decoded.emp_name,
            emp_role: decoded.emp_role
        };

        next();

    } catch (error) {

        return res.status(401).json({
            message: 'Invalid Token'
        });
    }
};