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
exports.getAllProducts = exports.deleteRecipe = exports.updateRecipe = exports.createRecipe = exports.getRecipes = exports.deleteStyle = exports.updateStyle = exports.createStyle = exports.getStyles = void 0;
const Style_1 = __importDefault(require("../models/Style"));
const Recipe_1 = __importDefault(require("../models/Recipe"));
// Styles
const getStyles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const styles = yield Style_1.default.find().sort({ createdAt: -1 });
        res.json(styles);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching styles' });
    }
});
exports.getStyles = getStyles;
const createStyle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const style = new Style_1.default(req.body);
        yield style.save();
        res.status(201).json(style);
    }
    catch (error) {
        res.status(400).json({ error: 'Error creating style' });
    }
});
exports.createStyle = createStyle;
const updateStyle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const style = yield Style_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(style);
    }
    catch (error) {
        res.status(500).json({ error: 'Error updating style' });
    }
});
exports.updateStyle = updateStyle;
const deleteStyle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Style_1.default.findByIdAndDelete(req.params.id);
        res.json({ message: 'Style deleted' });
    }
    catch (error) {
        res.status(500).json({ error: 'Error deleting style' });
    }
});
exports.deleteStyle = deleteStyle;
// Recipes
const getRecipes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recipes = yield Recipe_1.default.find().sort({ createdAt: -1 });
        res.json(recipes);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching recipes' });
    }
});
exports.getRecipes = getRecipes;
const createRecipe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recipe = new Recipe_1.default(req.body);
        yield recipe.save();
        res.status(201).json(recipe);
    }
    catch (error) {
        res.status(400).json({ error: 'Error creating recipe' });
    }
});
exports.createRecipe = createRecipe;
const updateRecipe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recipe = yield Recipe_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(recipe);
    }
    catch (error) {
        res.status(500).json({ error: 'Error updating recipe' });
    }
});
exports.updateRecipe = updateRecipe;
const deleteRecipe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Recipe_1.default.findByIdAndDelete(req.params.id);
        res.json({ message: 'Recipe deleted' });
    }
    catch (error) {
        res.status(500).json({ error: 'Error deleting recipe' });
    }
});
exports.deleteRecipe = deleteRecipe;
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [styles, recipes] = yield Promise.all([
            Style_1.default.find().sort({ createdAt: -1 }),
            Recipe_1.default.find().sort({ createdAt: -1 })
        ]);
        res.json({ styles, recipes });
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching products' });
    }
});
exports.getAllProducts = getAllProducts;
