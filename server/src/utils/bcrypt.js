import bcrypt from "bcryptjs";

// Hash password
export const hashPassword = async (plainPassword) => {
    const saltRounds = 10;
    return bcrypt.hash(plainPassword, saltRounds);
};

// Compare password
export const comparePassword = async (plainPassword, hashedPassword) => {
    return bcrypt.compare(plainPassword, hashedPassword);
};
