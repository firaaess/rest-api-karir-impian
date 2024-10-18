import jwt from 'jsonwebtoken';

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"
        if (!token) {
            return res.status(401).json({
                message: "Anda belum login",
                success: false,
            });
        }
        const decoded = await jwt.verify(token, process.env.SECRET_KEY);
        req.id = decoded.userId; // Ensure this matches your token payload
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: "Token expired",
                success: false,
            });
        }

        return res.status(500).json({
            message: "Terjadi kesalahan pada server",
            success: false,
        });
    }
};

export default isAuthenticated;
