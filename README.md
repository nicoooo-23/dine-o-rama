# Dine-O-Rama: A Food Court Management System
Needs Node.js 18+ and MongoDB with `dbRestaurants` (collection `restaurants`) imported.

1. `npm install`
2. `npm run hash -- "YourPassword123"`  (copy the printed hash)
3. Copy `.env.example` to `.env`; paste the hash into ADMIN_PASSWORD_HASH and set SESSION_SECRET using `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`
4. `npm start`  then open http://localhost:3000

Public: homepage search. Admin (admin.html, password login): add, edit, delete.
