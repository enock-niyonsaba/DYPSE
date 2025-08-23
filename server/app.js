"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_2 = require("express");
const routes_1 = __importDefault(require("./routes"));
const storage_1 = require("./utils/storage");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const route_utils_1 = require("./utils/route-utils");
const env_1 = require("./config/env");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: [env_1.env.frontendUrl, 'http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true
}));
app.use((0, cookie_parser_1.default)());
app.use((0, express_2.json)({ limit: '2mb' }));
app.use((0, express_2.urlencoded)({ extended: true }));
app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});
// Debug route to list all registered routes
app.get('/api/debug/routes', route_utils_1.listRoutes);
// Mount all API routes under /api
app.use('/api', routes_1.default);
// Serve uploaded files statically
(0, storage_1.ensureUploadsDir)();
app.use('/uploads', express_1.default.static(storage_1.UPLOADS_DIR, { fallthrough: true, maxAge: '1d' }));
exports.default = app;
