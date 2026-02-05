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
exports.getMe = exports.login = void 0;
const axios_1 = __importDefault(require("axios"));
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const WX_API_URL = 'https://api.weixin.qq.com/sns/jscode2session';
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { code, userInfo } = req.body;
        if (!code) {
            res.status(400).json({ error: 'Code is required' });
            return;
        }
        const appId = process.env.WX_APP_ID;
        const secret = process.env.WX_APP_SECRET;
        if (!appId || !secret) {
            res.status(500).json({ error: 'Server configuration error' });
            return;
        }
        const response = yield axios_1.default.get(WX_API_URL, {
            params: {
                appid: appId,
                secret: secret,
                js_code: code,
                grant_type: 'authorization_code'
            }
        });
        const { openid, session_key, errcode, errmsg } = response.data;
        if (errcode) {
            res.status(400).json({ error: errmsg || 'WeChat login failed' });
            return;
        }
        let user = yield User_1.default.findOne({ openid });
        if (!user) {
            user = new User_1.default({
                openid,
                nickName: (userInfo === null || userInfo === void 0 ? void 0 : userInfo.nickName) || '微信用户',
                avatarUrl: (userInfo === null || userInfo === void 0 ? void 0 : userInfo.avatarUrl) || ''
            });
        }
        else if (userInfo) {
            user.nickName = userInfo.nickName;
            user.avatarUrl = userInfo.avatarUrl;
        }
        yield user.save();
        // Generate JWT
        const token = jsonwebtoken_1.default.sign({ id: user._id, openid: user.openid, isAdmin: user.isAdmin }, process.env.JWT_SECRET || 'secret', {
            expiresIn: '7d'
        });
        res.json({
            token,
            user,
            openid // Frontend might expect openid
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.login = login;
const getMe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // @ts-ignore
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    const user = yield User_1.default.findById(userId);
    res.json(user);
});
exports.getMe = getMe;
