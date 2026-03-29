"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const leads_routes_1 = __importDefault(require("./routes/leads.routes"));
const tags_routes_1 = __importDefault(require("./routes/tags.routes"));
const tasks_routes_1 = __importDefault(require("./routes/tasks.routes"));
const app = (0, express_1.default)();
exports.app = app;
app.use(express_1.default.json({ limit: "10kb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "10kb" }));
app.use((0, cookie_parser_1.default)());
app.use("/api/leads", leads_routes_1.default);
app.use("/api/tags", tags_routes_1.default);
app.use("/api/tasks", tasks_routes_1.default);
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "SynQ CRM API is running",
        timestamp: new Date().toISOString(),
    });
});
