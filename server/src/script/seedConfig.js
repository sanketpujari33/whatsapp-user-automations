/**
 * Seed or update application config document.
 * Run: node src/script/seedConfig.js
 */
require("dotenv").config();
const mongoose = require("mongoose");
const Config = require("../models/configmodel");

function toNumber(value, fallback) {
	const num = Number(value);
	return Number.isFinite(num) ? num : fallback;
}

function buildConfigPayload() {
	return {
		NODE_ENV: process.env.NODE_ENV || "development",
		PORT: toNumber(process.env.PORT, 4000),
		DB_URL:
			process.env.DB_URL ||
			process.env.MONGO_URI ||
			"mongodb://127.0.0.1:27017/whatsapp_wallet",
		REDIS_URL: process.env.REDIS_URL || "redis://127.0.0.1:6379",

		JWT_SECRET: process.env.JWT_SECRET || "change-me-in-production",
		JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",

		OPENWA_BASE_URL: process.env.OPENWA_BASE_URL || "http://localhost:2785",
		OPENWA_API_KEY: process.env.OPENWA_API_KEY || "",
		OPENWA_AUTH_HEADER: process.env.OPENWA_AUTH_HEADER || "x-api-key",
		DEFAULT_SESSION_ID: process.env.DEFAULT_SESSION_ID || "default",

		ADMIN_EMAIL: process.env.ADMIN_EMAIL || "admin@local.test",
		ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "Admin@123",
		WELCOME_BONUS: toNumber(process.env.WELCOME_BONUS, 0),

		RECHARGE_API_URL: process.env.RECHARGE_API_URL || "",
		RECHARGE_API_TOKEN: process.env.RECHARGE_API_TOKEN || "",

		REDIS_ENV: process.env.REDIS_ENV || "local",
		REDIS_PROVIDER: process.env.REDIS_PROVIDER || "",
		REDIS_HOST: process.env.REDIS_HOST || "",
		REDIS_PASSWORD: process.env.REDIS_PASSWORD || "",
		REDIS_TLS: process.env.REDIS_TLS || "false",
		UPSTASH_REDIS_URL: process.env.UPSTASH_REDIS_URL || "",

		NUMBER_OF_CLUSTER_WORKER: toNumber(process.env.NUMBER_OF_CLUSTER_WORKER, 1),
	};
}

async function run() {
	try {
		const dbUrl =
			process.env.DB_URL ||
			process.env.MONGO_URI ||
			"mongodb://127.0.0.1:27017/whatsapp_wallet";

		await mongoose.connect(dbUrl);
		console.log("✅ Connected to MongoDB");

		const payload = buildConfigPayload();
		const existing = await Config.findOne();

		if (existing) {
			existing.set(payload);
			await existing.save();
			console.log("✅ Config updated");
			console.log("   Config ID:", existing._id.toString());
		} else {
			const created = await Config.create(payload);
			console.log("✅ Config created");
			console.log("   Config ID:", created._id.toString());
		}

		await mongoose.disconnect();
		process.exit(0);
	} catch (error) {
		console.error("❌ Failed to seed config:", error.message);
		process.exit(1);
	}
}

run();
