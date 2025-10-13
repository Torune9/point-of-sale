import jwt from "jsonwebtoken";
const privateKey = process.env.PRIVATE_KEY;

if (!privateKey) {
    throw new Error("PRIVATE_KEY is not set in environment variables");
}

const generateToken = (payload: object) => {
    return jwt.sign(payload, privateKey, { expiresIn: "1h" });
};

const verifyToken = (token: string) => {
    return jwt.verify(token, privateKey)
}

export { generateToken, verifyToken }
