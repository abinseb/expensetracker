import { Pool } from "pg";

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// ── DB connection logging (visible in your terminal / server console) ──
pool.on("connect", (client) => {
    console.log(
        `[DB] ✅ New client connected  | total: ${pool.totalCount}  idle: ${pool.idleCount}  waiting: ${pool.waitingCount}`
    );
    // Log which database we're connected to (runs once per new client)
    client.query("SELECT current_database(), current_user, inet_server_addr(), inet_server_port()")
        .then(({ rows }) => {
            const r = rows[0];
            console.log(
                `[DB] 📡 Connected to database="${r.current_database}" user="${r.current_user}" host=${r.inet_server_addr}:${r.inet_server_port}`
            );
        })
        .catch(() => { /* non-fatal */ });
});

pool.on("error", (err) => {
    console.error("[DB] ❌ Pool error:", err.message);
});

pool.on("remove", () => {
    console.log(
        `[DB] 🔌 Client removed from pool | total: ${pool.totalCount}  idle: ${pool.idleCount}`
    );
});