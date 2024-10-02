"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const usersControllers_1 = require("../controllers/usersControllers");
const router = express_1.default.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'default-secret';
//Middleware de JWT para ver si estamos autenticados
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'No autorizado' });
    }
    jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('Error en la autenticación: ', err);
            return res.status(403).json({ error: 'No tienes acceso a este recurso' });
        }
        next();
    });
};
router.post('/', authenticateToken, usersControllers_1.createUser);
router.get('/', authenticateToken, usersControllers_1.getAllUsers);
router.get('/:id', authenticateToken, usersControllers_1.getUserById);
router.put('/:id', authenticateToken, usersControllers_1.updateUser);
router.delete('/:id', authenticateToken, usersControllers_1.deleteUser);
exports.default = router;
