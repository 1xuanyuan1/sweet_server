"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productController_1 = require("../controllers/productController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.get('/all', productController_1.getAllProducts); // For homepage
router.get('/styles', productController_1.getStyles);
router.post('/styles', authMiddleware_1.authenticate, authMiddleware_1.isAdmin, productController_1.createStyle);
router.put('/styles/:id', authMiddleware_1.authenticate, authMiddleware_1.isAdmin, productController_1.updateStyle);
router.delete('/styles/:id', authMiddleware_1.authenticate, authMiddleware_1.isAdmin, productController_1.deleteStyle);
router.get('/recipes', productController_1.getRecipes);
router.post('/recipes', authMiddleware_1.authenticate, authMiddleware_1.isAdmin, productController_1.createRecipe);
router.put('/recipes/:id', authMiddleware_1.authenticate, authMiddleware_1.isAdmin, productController_1.updateRecipe);
router.delete('/recipes/:id', authMiddleware_1.authenticate, authMiddleware_1.isAdmin, productController_1.deleteRecipe);
exports.default = router;
