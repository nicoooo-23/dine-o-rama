// Usage: npm run hash -- yourPassword   -> prints the value for ADMIN_PASSWORD_HASH
const bcrypt = require('bcryptjs');
const pw = process.argv[2];
if (!pw || pw.length < 8) { console.log('Give a password of 8+ characters.'); process.exit(1); }
console.log(bcrypt.hashSync(pw, 12));
