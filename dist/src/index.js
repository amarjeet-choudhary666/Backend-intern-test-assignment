"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./db/db");
dotenv_1.default.config();
const port = process.env.PORT || 4000;
(0, db_1.connectionDb)().then(() => {
    app_1.app.listen(port, () => {
        console.log(`⚡️ Server is running on port ${port}`);
    });
}).catch((err) => {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
});
