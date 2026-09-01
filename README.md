# WhatsApp Wallet Bot Platform

This project is a full-stack starter for a WhatsApp wallet automation system using:

- Node.js + Express backend
- OpenWA API integration
- MongoDB for persistent data
- Redis + BullMQ for queue and state
- React admin panel
- Socket.IO for live updates

## What is implemented

- New-user auto registration on first message
- Welcome message and menu-driven bot flow
- Wallet balance check
- Balance transfer flow with validation and confirmation
- Recharge request flow with queue worker and status updates
- Conversation logs in MongoDB
- Admin login with JWT
- Admin dashboard for stats, sessions, transfer, and wallet credit
- OpenWA session list and QR fetch API bridge

## Core APIs

- `POST /api/bot/webhook` OpenWA webhook target
- `POST /api/auth/login` Admin login
- `GET /api/admin/overview` Dashboard cards and recent transactions
- `GET /api/users` Users list
- `GET /api/wallets` Wallet list
- `POST /api/wallets/credit-by-phone` Credit wallet
- `POST /api/wallets/transfer-by-phone` Transfer balance
- `GET /api/transactions` Transactions list
- `GET /api/sessions` OpenWA sessions
- `GET /api/sessions/:sessionId/qr` OpenWA QR data

## Bot Menu Flow

User sends `M` or any message for first-time onboarding.

1. Wallet Balance
2. Transfer Balance
3. Transaction History
4. Mobile Recharge
5. Help

## Local setup

1. Copy environment files:

   - `server/.env.example` to `server/.env`
   - `admin/.env.example` to `admin/.env`

2. Install dependencies:

   - `npm install`
   - `npm --prefix server install`
   - `npm --prefix admin install`

3. Start MongoDB and Redis:

   - `docker compose up -d mongo redis`

4. Start server and admin:

   - `npm run dev`

5. Configure OpenWA to send inbound message events to:

   - `http://<your-server-host>:4000/api/bot/webhook`

## Default admin credentials

- Email: `admin@local.test`
- Password: `Admin@123`

Change them in `server/.env` before production.

## Notes for production

- Add proper request signing for webhooks
- Add transaction-level idempotency keys
- Add per-user transfer limits and AML rules
- Add full audit trail and role-based permissions
- Use official WhatsApp Business Platform if long-term account reliability is required