const { execSync } = require("child_process");

try {
  console.log("Running migrations...");
  execSync("npm run migrate", { stdio: "inherit" });
  console.log("Migrations completed.");
} catch (error) {
  console.error("Failed to run migrations:", error);
  process.exit(1);
}

// Start the Next.js server
execSync("next start", { stdio: "inherit" });
