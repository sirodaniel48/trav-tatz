require("dotenv").config({ path: ".env.local" });
const bcrypt = require("bcryptjs");

async function main() {
  const hash = process.env.ADMIN_PASSWORD_HASH;
  console.log("Hash loaded from env:", hash);
  const pw = "admin123";
  const isValid = await bcrypt.compare(pw, hash);
  console.log("Is 'admin123' valid for this hash?", isValid);
}
main();
