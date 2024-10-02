"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const password_service_1 = require("../services/password.service");
const user_1 = __importDefault(require("../models/user"));
const auth_services_1 = require("../services/auth.services");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { email, password } = req.body;
    try {
        if (!email) {
            res.status(400).json({ message: 'El email es obligatorio' });
            return;
        }
        if (!password) {
            res.status(400).json({ message: 'El password es obligatorio' });
            return;
        }
        const hashedPassword = yield (0, password_service_1.hashPassword)(password);
        const user = yield user_1.default.create({
            data: {
                email,
                password: hashedPassword
            }
        });
        const token = (0, auth_services_1.generateToken)(user);
        res.status(201).json({ token });
    }
    catch (error) {
        if ((error === null || error === void 0 ? void 0 : error.code) === 'P2002' && ((_b = (_a = error === null || error === void 0 ? void 0 : error.meta) === null || _a === void 0 ? void 0 : _a.target) === null || _b === void 0 ? void 0 : _b.includes('email'))) {
            res.status(400).json({ message: 'El mail ingresado ya existe' });
        }
        console.log(error);
        res.status(500).json({ error: 'Hubo un error en el registro' });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        if (!email) {
            res.status(400).json({ message: 'El email es obligatorio' });
            return;
        }
        if (!password) {
            res.status(400).json({ message: 'El password es obligatorio' });
            return;
        }
        const user = yield user_1.default.findUnique({ where: { email } });
        if (!user) {
            res.status(404).json({ error: 'Usuario no encontrado' });
            return;
        }
        const passwordMatch = yield (0, password_service_1.comparePasswords)(password, user.password);
        if (!passwordMatch) {
            res.status(401).json({ error: 'Usuario y contraseñas no coinciden' });
        }
        const token = (0, auth_services_1.generateToken)(user);
        res.status(200).json({ token });
    }
    catch (error) {
        console.log('Error: ', error);
    }
});
exports.login = login;
