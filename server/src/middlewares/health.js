/**
 * Health Check Middleware
 * Returns detailed system health including all component statuses.
 * Mounted at GET /health (before auth middleware for external monitoring).
 */
const mongoose = require('mongoose');
const { version } = require('../../package.json');
const { getAllBreakers } = require('../utils/circuitBreaker');
const radis = require('../utils/radis/indexRadis');
const express = require('express');

let startTime = Date.now();

async function healthCheck(req, res) {
  const checks = {
    ok: true,
    service: 'whatsapp-wallet-server',
    status: 'healthy',
    version,
    uptime: Math.floor((Date.now() - startTime) / 1000),
    timestamp: new Date().toISOString(),
    components: {},
  };

  // MongoDB
  try {
    const mongoState = mongoose.connection.readyState;
    const mongoStatus = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    const start = Date.now();
    await mongoose.connection.db.admin().ping();
    checks.components.mongodb = {
      status: mongoState === 1 ? 'healthy' : mongoStatus[mongoState] || 'unknown',
      latency: `${Date.now() - start}ms`,
      host: mongoose.connection.host,
      poolSize: mongoose.connection.client?.options?.maxPoolSize || 50,
    };
  } catch (err) {
    checks.components.mongodb = { status: 'unhealthy', error: err.message };
    checks.status = 'degraded';
  }

  // Redis
  try {
    const start = Date.now();
    const redisClient = await radis.getClient();
    const redisState = String(redisClient?.status || '').toLowerCase();
    const pong = redisClient && typeof redisClient.ping === 'function' ? await redisClient.ping() : null;
    const healthy = String(pong || '').toUpperCase() === 'PONG';

    checks.components.redis = {
      status: healthy ? 'healthy' : (redisState || 'unknown'),
      latency: `${Date.now() - start}ms`,
      clientState: redisState || 'unknown',
    };

    if (!healthy && checks.status === 'healthy') {
      checks.status = 'degraded';
    }
  } catch (err) {
    checks.components.redis = { status: 'unhealthy', error: err.message };
    if (checks.status === 'healthy') checks.status = 'degraded';
  }

  // Circuit Breakers
  try {
    const breakerStats = getAllBreakers();
    const openBreakers = Object.entries(breakerStats).filter(([_, s]) => s.state === 'OPEN');
    checks.components.circuitBreakers = {
      total: Object.keys(breakerStats).length,
      open: openBreakers.length,
      breakers: breakerStats,
    };
  } catch (err) {
    checks.components.circuitBreakers = { status: 'unknown', error: err.message };
  }

  // Process info
  checks.process = {
    pid: process.pid,
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
    node: process.version,
    platform: process.platform,
  };

  checks.ok = checks.status === 'healthy';
  const httpCode = checks.status === 'healthy' ? 200 : 503;
  return res.status(httpCode).json(checks);
}

const healthRouter = express.Router();
healthRouter.get('/health', healthCheck);

module.exports = { healthCheck, healthRouter };
