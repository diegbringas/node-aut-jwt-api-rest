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
exports.deleteUser = exports.updateUser = exports.getUserById = exports.getAllUsers = exports.createUser = void 0;
const password_service_1 = require("../services/password.service");
const user_1 = __importDefault(require("../models/user"));
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { email, password } = req.body;
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
        res.status(201).json(user);
    }
    catch (error) {
        if ((error === null || error === void 0 ? void 0 : error.code) === 'P2002' && ((_b = (_a = error === null || error === void 0 ? void 0 : error.meta) === null || _a === void 0 ? void 0 : _a.target) === null || _b === void 0 ? void 0 : _b.includes('email'))) {
            res.status(400).json({ message: 'El mail ingresado ya existe' });
        }
        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
    }
});
exports.createUser = createUser;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_1.default.findMany();
        res.status(200).json(users);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
    }
});
exports.getAllUsers = getAllUsers;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = parseInt(req.params.id);
    try {
        const user = yield user_1.default.findUnique({
            where: {
                id: userId
            }
        });
        if (!user) {
            res.status(404).json({ error: 'El usuario no fue encontrado' });
            return;
        }
        res.status(200).json(user);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
    }
});
exports.getUserById = getUserById;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const userId = parseInt(req.params.id);
    const { email, password } = req.body;
    try {
        let dataToUpdate = Object.assign({}, req.body);
        if (password) {
            const hashedPassword = yield (0, password_service_1.hashPassword)(password);
            dataToUpdate.password = hashedPassword;
        }
        if (email) {
            dataToUpdate.email = email;
        }
        const user = yield user_1.default.update({
            where: {
                id: userId
            },
            data: dataToUpdate
        });
        res.status(200).json(user);
    }
    catch (error) {
        if ((error === null || error === void 0 ? void 0 : error.code) === 'P2002' && ((_b = (_a = error === null || error === void 0 ? void 0 : error.meta) === null || _a === void 0 ? void 0 : _a.target) === null || _b === void 0 ? void 0 : _b.includes('email'))) {
            res.status(400).json({ error: 'El email ingresado ya existe' });
        }
        else if ((error === null || error === void 0 ? void 0 : error.code) == 'P2025') {
            res.status(404).json('Usuario no encontrado');
        }
        else {
            console.log(error);
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
        }
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = parseInt(req.params.id);
    try {
        yield user_1.default.delete({
            where: {
                id: userId
            }
        });
        res.status(200).json({
            message: `El usuario ${userId} ha sido eliminado`
        }).end();
    }
    catch (error) {
        if ((error === null || error === void 0 ? void 0 : error.code) == 'P2025') {
            res.status(404).json('Usuario no encontrado');
        }
        else {
            console.log(error);
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
        }
    }
});
exports.deleteUser = deleteUser;
