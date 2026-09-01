const radis = require('../radis/indexRadis');

const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 60;

async function checkRateLimit(key, maxReqs = MAX_REQUESTS, windowMs = WINDOW_MS) {
  if (!key) return { allowed: true, remaining: maxReqs, resetTime: 0 };

  const windowKey = `rate:${key}:${Math.floor(Date.now() / windowMs)}`;
  const ttlSec = Math.ceil(windowMs / 1000);

  try {
    const current = await radis.increment(windowKey, ttlSec);
    if (current === null) return { allowed: true, remaining: maxReqs, resetTime: 0 };

    const allowed = current <= maxReqs;
    const remaining = Math.max(0, maxReqs - current);
    const resetTime = (Math.floor(Date.now() / windowMs) + 1) * windowMs;

    return { allowed, remaining, resetTime, current };
  } catch {
    return { allowed: true, remaining: maxReqs, resetTime: 0 };
  }
}

function rateLimiter(options = {}) {
  const windowMs = options.windowMs || WINDOW_MS;
  const max = options.max || MAX_REQUESTS;
  const keyGenerator = options.keyGenerator || ((req) => req.ip || req.connection?.remoteAddress || 'unknown');

  return async (req, res, next) => {
    try {
      const key = keyGenerator(req);
      const result = await checkRateLimit(key, max, windowMs);

      res.setHeader('X-RateLimit-Limit', max);
      res.setHeader('X-RateLimit-Remaining', result.remaining);
      res.setHeader('X-RateLimit-Reset', Math.ceil(result.resetTime / 1000));

      if (!result.allowed) {
        return res.status(429).json({
          success: false,
          message: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil(result.resetTime / 1000 - Date.now() / 1000),
        });
      }

      next();
    } catch {
      next();
    }
  };
}

module.exports = {
  checkRateLimit,
  rateLimiter,
  WINDOW_MS,
  MAX_REQUESTS,
};
