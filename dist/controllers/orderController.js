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
exports.getStats = exports.confirmOrder = exports.updateOrderStatus = exports.updateOrderPrice = exports.getAllOrders = exports.getOrderById = exports.getMyOrders = exports.createOrder = void 0;
const Order_1 = __importDefault(require("../models/Order"));
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // @ts-ignore
        const openid = req.user.openid;
        const order = new Order_1.default(Object.assign(Object.assign({}, req.body), { openid, status: "pending" }));
        yield order.save();
        res.status(201).json(order);
    }
    catch (error) {
        res.status(400).json({ error: "Error creating order" });
    }
});
exports.createOrder = createOrder;
const getMyOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // @ts-ignore
        const openid = req.user.openid;
        const orders = yield Order_1.default.find({ openid }).sort({ createdAt: -1 });
        res.json(orders);
    }
    catch (error) {
        res.status(500).json({ error: "Error fetching orders" });
    }
});
exports.getMyOrders = getMyOrders;
const getOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // @ts-ignore
        const openid = req.user.openid;
        const order = yield Order_1.default.findById(req.params.id);
        if (!order) {
            res.status(404).json({ error: "Order not found" });
            return;
        }
        if (order.openid !== openid) {
            res.status(403).json({ error: "Access denied" });
            return;
        }
        res.json(order);
    }
    catch (error) {
        res.status(500).json({ error: "Error fetching order" });
    }
});
exports.getOrderById = getOrderById;
const getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status, month, year } = req.query;
        const matchStage = {};
        // Filter by status (single or comma-separated)
        if (status) {
            const statuses = status.split(",");
            matchStage.status = { $in: statuses };
        }
        // Filter by month/year
        if (month && year) {
            const startDate = new Date(Number(year), Number(month) - 1, 1);
            const endDate = new Date(Number(year), Number(month), 0, 23, 59, 59);
            matchStage.createdAt = {
                $gte: startDate,
                $lte: endDate,
            };
        }
        const orders = yield Order_1.default.aggregate([
            { $match: matchStage },
            { $sort: { createdAt: -1 } },
            { $limit: 100 },
            {
                $lookup: {
                    from: "users",
                    localField: "openid",
                    foreignField: "openid",
                    as: "userInfo",
                },
            },
            {
                $unwind: {
                    path: "$userInfo",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    _id: 1,
                    status: 1,
                    recipe: 1,
                    style: 1,
                    quantity: 1,
                    originalPrice: 1,
                    finalPrice: 1,
                    expressCompany: 1,
                    expressNumber: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    userInfo: {
                        nickName: 1,
                        avatarUrl: 1,
                    },
                },
            },
        ]);
        res.json(orders);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error fetching all orders" });
    }
});
exports.getAllOrders = getAllOrders;
const updateOrderPrice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { finalPrice } = req.body;
        const order = yield Order_1.default.findByIdAndUpdate(id, { finalPrice, status: "wait_confirm" }, { new: true });
        res.json(order);
    }
    catch (error) {
        res.status(500).json({ error: "Error updating price" });
    }
});
exports.updateOrderPrice = updateOrderPrice;
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status, expressCompany, expressNumber } = req.body;
        const updateData = { status };
        if (expressCompany)
            updateData.expressCompany = expressCompany;
        if (expressNumber)
            updateData.expressNumber = expressNumber;
        const order = yield Order_1.default.findByIdAndUpdate(id, updateData, { new: true });
        res.json(order);
    }
    catch (error) {
        res.status(500).json({ error: "Error updating status" });
    }
});
exports.updateOrderStatus = updateOrderStatus;
const confirmOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // @ts-ignore
        const openid = req.user.openid;
        const order = yield Order_1.default.findById(req.params.id);
        if (!order) {
            res.status(404).json({ error: "Order not found" });
            return;
        }
        if (order.openid !== openid) {
            res.status(403).json({ error: "Access denied" });
            return;
        }
        if (order.status !== "wait_confirm") {
            res.status(400).json({ error: "Invalid order status" });
            return;
        }
        order.status = "confirmed";
        yield order.save();
        res.json(order);
    }
    catch (error) {
        res.status(500).json({ error: "Error confirming order" });
    }
});
exports.confirmOrder = confirmOrder;
const getStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalOrders = yield Order_1.default.countDocuments();
        // 1. Monthly Stats: Total Sales, Paid Amount, Pending Amount
        const monthlyStats = yield Order_1.default.aggregate([
            {
                $match: {
                    status: { $ne: "cancelled" },
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                    },
                    totalSales: { $sum: { $ifNull: ["$finalPrice", "$originalPrice"] } },
                    paidAmount: {
                        $sum: {
                            $cond: [
                                {
                                    $in: [
                                        "$status",
                                        ["paid", "producing", "shipped", "received"],
                                    ],
                                },
                                { $ifNull: ["$finalPrice", "$originalPrice"] },
                                0,
                            ],
                        },
                    },
                    pendingAmount: {
                        $sum: {
                            $cond: [
                                { $in: ["$status", ["pending", "wait_confirm", "confirmed"]] },
                                { $ifNull: ["$finalPrice", "$originalPrice"] },
                                0,
                            ],
                        },
                    },
                    orderCount: { $sum: 1 },
                },
            },
            { $sort: { "_id.year": -1, "_id.month": -1 } },
        ]);
        // 2. Pending Payment Details (List of orders waiting for payment)
        // We can fetch this separately or the frontend can use filtering on the order list.
        // But for "clicking to view details", returning a list of pending orders here might be heavy if there are many.
        // Better approach: The frontend should call /api/orders/admin/all?status=pending (need to implement filter support)
        // For now, let's return a simplified list of pending orders for quick view if needed, or just the stats.
        // Let's stick to returning stats here.
        // To "view details", the frontend should navigate to the order list with a filter.
        // 3. Status Distribution (Existing)
        const statusDistribution = yield Order_1.default.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
        ]);
        res.json({
            totalOrders,
            monthlyStats,
            statusDistribution,
        });
    }
    catch (error) {
        console.error("Stats error:", error);
        res.status(500).json({ error: "Error fetching stats" });
    }
});
exports.getStats = getStats;
