"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const mongodb_1 = require("./config/mongodb");
const auth_1 = __importDefault(require("./routes/auth"));
const dotenv_1 = __importDefault(require("dotenv"));
async function start() {
    try {
        // Load environment variables
        dotenv_1.default.config();
        // Connect to MongoDB
        await (0, mongodb_1.connectMongoDB)();
        // Health check route
        app_1.default.get('/', (req, res) => {
            res.send('DYPSM API IS RUNNING');
        });
        // Test API route
        app_1.default.get('/api/test', (req, res) => {
            res.json({ message: 'API test successful', status: 'ok' });
        });
        // Mount auth routes
        app_1.default.use('/api/auth', auth_1.default);
        console.log('Auth routes are mounted at /api/auth');
        // Start server
        const port = process.env.PORT || 5000;
        app_1.default.listen(port, () => {
            console.log(`Server listening on port http://localhost:${port}`);
        });
    }
    catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
}
start();