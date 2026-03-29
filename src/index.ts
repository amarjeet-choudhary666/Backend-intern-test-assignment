import { app } from "./app";
import dotenv from "dotenv";
import { connectionDb } from "./db/db";

dotenv.config();

const port = process.env.PORT || 4000;

connectionDb().then(() => {
    app.listen(port, () => {
        console.log(`⚡️ Server is running on port ${port}`);
    });
}).catch((err) => {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
});
