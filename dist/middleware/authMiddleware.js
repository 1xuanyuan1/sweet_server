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
exports.isAdmin = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ error: "No token provided" });
        return;
    }
    const [scheme, token] = authHeader.split(" ");
    if (scheme !== "Bearer" || !token) {
        res.status(401).json({ error: "Invalid token" });
        return;
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        res.status(500).json({ error: "Server configuration error" });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secret, { algorithms: ["HS256"] });
        // @ts-ignore
        req.user = { id: decoded.id, openid: decoded.openid };
        next();
    }
    catch (error) {
        res.status(401).json({ error: "Invalid token" });
    }
};
exports.authenticate = authenticate;
const isAdmin = (req, res, next) => {
    (() => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        // @ts-ignore
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const user = yield User_1.default.findById(userId).select("isAdmin").lean();
        if (!(user === null || user === void 0 ? void 0 : user.isAdmin)) {
            res.status(403).json({ error: "Access denied" });
            return;
        }
        next();
    }))().catch(() => {
        res.status(500).json({ error: "Internal server error" });
    });
};
exports.isAdmin = isAdmin;
