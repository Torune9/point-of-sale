import { Server } from "socket.io"
import { verifyToken } from "./utils/verifyTokenSocket.js"
import { logger } from "./utils/logger.js"

let io: Server

export const initSocket = (server: any) => {
    io = new Server(server, {
        cors: {
            origin: ["http://localhost:5173"],
            credentials: true
        }
    })

    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth.token

            if (!token) {
                return next(new Error("Unauthorized"));
            }

            const user = verifyToken(token);
            socket.data.user = user;

            logger.info(`socket auth with userId : ${user.id}`)
            next();
        } catch (err) {
            logger.error('sockt auth invalid')
            next(new Error("Unauthorized"));
        }
    });


    io.on("connection", (socket) => {
        
        const { id, roleId, businessId } = socket.data.user

        // JOIN ROOM PER STORE
        socket.join(`store:${businessId}`)
        logger.info(`User joined business:${businessId}`)
        socket.on("disconnect", () => {
            logger.info('Socket disconnected')
        })
    })
}

export const getIO = () => io
