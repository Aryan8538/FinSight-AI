import app from "./app.js";
import { connectDatabase } from "./config/db.js";
import { env } from "./config/env.js";

async function start() {
  await connectDatabase();
  app.listen(env.port, () => {
    console.log(`FinSight API running at http://localhost:${env.port}/api/v1`);
  });
}

start().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});

