// import { config } from "dotenv";

// config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

// export const { PORT, NODE_ENV, DB_URI, JWT_SECRET, JWT_EXPIRES_IN } =
//   process.env;
import { config } from "dotenv";

// Load environment variables only if not running on Vercel
if (!process.env.VERCEL) {
  config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });
}

// Export environment variables
export const { PORT, NODE_ENV, DB_URI, JWT_SECRET, JWT_EXPIRES_IN } =
  process.env;
