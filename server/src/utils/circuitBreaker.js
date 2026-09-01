/**
 * Circuit Breaker — Enterprise Resilience Pattern
 *
 * Prevents cascading failures when external services (payments, AI, SMS, email) are down.
 *
 * States:
 *   CLOSED    — Normal operation. Requests pass through.
 *   OPEN      — Failures exceed threshold. Requests fail fast (no attempt).
 *   HALF_OPEN — Recovery period. One test request allowed.
 *
 * Usage:
 *   const breaker = new CircuitBreaker('razorpay', { threshold: 5, resetTimeout: 30000 });
 *   await breaker.call(() => razorpayApi.charge(amount));
 */

const logger = console; // Will be replaced with Pino logger

class CircuitBreaker {
  constructor(name, options = {}) {
    this.name = name;
    this.threshold = options.threshold || 5;       // failures before OPEN
    this.resetTimeout = options.resetTimeout || 30000; // ms before HALF_OPEN
    this.timeout = options.timeout || 10000;        // per-call timeout ms

    this.state = 'CLOSED';
    this.failureCount = 0;
    this.successCount = 0;
    this.lastFailureTime = null;
    this.lastSuccessTime = null;
    this.nextAttempt = null;
  }

  /**
   * Execute a function through the circuit breaker.
   * @param {Function} fn - Async function to execute
   * @param {Object} [options]
   * @param {number} [options.timeout] - Override timeout for this call
   * @returns {Promise<any>} — Result from fn, or throws CircuitBreakerOpenError
   */
  async call(fn, options = {}) {
    this._checkState();

    if (this.state === 'OPEN') {
      const error = new CircuitBreakerOpenError(`Circuit breaker OPEN for ${this.name}`);
      logger.warn(`[CircuitBreaker] ${this.name}: OPEN — failing fast`);
      throw error;
    }

    const callTimeout = options.timeout || this.timeout;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), callTimeout);

    try {
      const result = await Promise.race([
        fn({ signal: controller.signal }),
        new Promise((_, reject) => {
          controller.signal.addEventListener('abort', () => {
            reject(new Error(`Request timed out after ${callTimeout}ms`));
          });
        }),
      ]);

      clearTimeout(timeoutId);
      this._onSuccess();
      return result;
    } catch (error) {
      clearTimeout(timeoutId);
      this._onFailure(error);
      throw error;
    }
  }

  _checkState() {
    if (this.state === 'OPEN' && this.nextAttempt && Date.now() >= this.nextAttempt) {
      logger.info(`[CircuitBreaker] ${this.name}: OPEN → HALF_OPEN (attempting recovery)`);
      this.state = 'HALF_OPEN';
      this.failureCount = 0;
    }
  }

  _onSuccess() {
    this.successCount++;
    this.lastSuccessTime = Date.now();

    if (this.state === 'HALF_OPEN') {
      logger.info(`[CircuitBreaker] ${this.name}: HALF_OPEN → CLOSED (recovered)`);
      this.state = 'CLOSED';
      this.failureCount = 0;
    }
  }

  _onFailure(error) {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.state === 'HALF_OPEN') {
      logger.warn(`[CircuitBreaker] ${this.name}: HALF_OPEN → OPEN (recovery failed)`);
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.resetTimeout;
    } else if (this.failureCount >= this.threshold) {
      logger.warn(`[CircuitBreaker] ${this.name}: CLOSED → OPEN (${this.failureCount} failures)`);
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.resetTimeout;
    }
  }

  getState() { return this.state; }
  getStats() {
    return {
      name: this.name,
      state: this.state,
      failureCount: this.failureCount,
      successCount: this.successCount,
      lastFailureTime: this.lastFailureTime,
      lastSuccessTime: this.lastSuccessTime,
    };
  }

  reset() {
    this.state = 'CLOSED';
    this.failureCount = 0;
    this.successCount = 0;
    this.nextAttempt = null;
  }
}

class CircuitBreakerOpenError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CircuitBreakerOpenError';
    this.code = 'CIRCUIT_OPEN';
  }
}

// ── Shared breaker instances ─────────────────────────────────────────
const breakers = new Map();

function getBreaker(name, options) {
  if (!breakers.has(name)) {
    breakers.set(name, new CircuitBreaker(name, options));
  }
  return breakers.get(name);
}

function getAllBreakers() {
  const result = {};
  for (const [name, breaker] of breakers) {
    result[name] = breaker.getStats();
  }
  return result;
}

module.exports = {
  CircuitBreaker,
  CircuitBreakerOpenError,
  getBreaker,
  getAllBreakers,
};
