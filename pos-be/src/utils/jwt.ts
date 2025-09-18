import jwt from "jsonwebtoken";
const privateKey = process.env.PRIVATE_KEY;

const generateToken = (payload: object) => {

    if (!privateKey) {
        throw new Error("PRIVATE_KEY is not set in environment variables");
    }

    return jwt.sign(payload, privateKey, { expiresIn: "1h" });
};

const verifyToken = (token: string) => {
    if (!privateKey) {
        throw new Error("PRIVATE_KEY is not set in environment variables");
    }
    return jwt.verify(token, privateKey)
}


export { generateToken, verifyToken }
