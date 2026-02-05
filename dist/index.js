"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const auth_1 = __importDefault(require("./routes/auth"));
const product_1 = __importDefault(require("./routes/product"));
const order_1 = __importDefault(require("./routes/order"));
const upload_1 = __importDefault(require("./routes/upload"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Static files
const uploadDir = process.env.UPLOAD_DIR || 'uploads';
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express_1.default.static(path_1.default.join(process.cwd(), uploadDir)));
// Database Connection
mongoose_1.default.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sweet')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));
// Routes
app.use('/api/auth', auth_1.default);
app.use('/api/products', product_1.default);
app.use('/api/orders', order_1.default);
app.use('/api/upload', upload_1.default);
// Health check
app.get('/', (req, res) => {
    res.send('Sweet API is running');
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
