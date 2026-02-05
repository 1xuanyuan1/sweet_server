"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderController_1 = require("../controllers/orderController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.post("/", authMiddleware_1.authenticate, orderController_1.createOrder);
router.get("/my", authMiddleware_1.authenticate, orderController_1.getMyOrders);
// Admin routes
router.get("/admin/all", authMiddleware_1.authenticate, authMiddleware_1.isAdmin, orderController_1.getAllOrders);
router.put("/admin/:id/price", authMiddleware_1.authenticate, authMiddleware_1.isAdmin, orderController_1.updateOrderPrice);
router.put("/admin/:id/status", authMiddleware_1.authenticate, authMiddleware_1.isAdmin, orderController_1.updateOrderStatus);
router.get("/admin/stats", authMiddleware_1.authenticate, authMiddleware_1.isAdmin, orderController_1.getStats);
router.get("/:id", authMiddleware_1.authenticate, orderController_1.getOrderById);
router.put("/:id/confirm", authMiddleware_1.authenticate, orderController_1.confirmOrder);
exports.default = router;
