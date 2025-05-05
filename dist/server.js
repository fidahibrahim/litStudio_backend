"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./infrastructure/config/db"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const userRouter_1 = __importDefault(require("./infrastructure/routes/userRouter"));
const app = (0, express_1.default)();
dotenv_1.default.config();
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use((0, cors_1.default)({
    origin: 'https://lit-studio-frontend-ips8.vercel.app',
    credentials: true
}));
app.use(express_1.default.json());
app.use("/api", userRouter_1.default);
const PORT = process.env.PORT || 4000;
const httpServer = (0, http_1.createServer)(app);
(0, db_1.default)();
httpServer.listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT}`);
});
