import jwt from "jsonwebtoken";
import md5 from "md5";
import { loginUser } from "../services/authservice.js";

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await loginUser({ email });

        if (!user) {
            return res.status(404).json({ message: "Staff Id not Correct" });
        }

        // ✅ ENABLE THIS IN REAL PROJECT
        if (user.password !== md5(password)) {
            return res.status(400).json({ message: "Password not Correct" });
        }
        const token = jwt.sign(
            {
                user_id: user.id,
                emp_email: user.email,
                emp_name: user.name,
                emp_role: user.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            success: true,
            message: "Login Success",
            token,
            user: {
                user_id: user.id,
                emp_email: user.email,
                emp_name: user.name,
                emp_role: user.role,
            },
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
