// Build step: stamp the shop status from the SHOP_OPEN environment variable
// into <html data-shop="...">. SHOP_OPEN="false" closes the shop; anything
// else (including unset) leaves it open.
const fs = require("fs");

const status = process.env.SHOP_OPEN === "false" ? "closed" : "open";
const file = "index.html";

const html = fs.readFileSync(file, "utf8");
const stamped = html.replace(/(<html\b[^>]*\bdata-shop=")[^"]*(")/, `$1${status}$2`);

if (stamped === html && !html.includes(`data-shop="${status}"`)) {
  console.error(`build: no data-shop attribute found in ${file}`);
  process.exit(1);
}

fs.writeFileSync(file, stamped);
console.log(`build: shop is ${status}`);
