// Build step: stamp the shop status from the SHOP_OPEN environment variable
// into <html data-shop="...">. SHOP_OPEN="false" closes the shop, any other
// value opens it. When the variable is absent the committed value is kept,
// so a missing build environment cannot silently reopen a closed shop.
import fs from "node:fs";

const file = "index.html";
const raw = process.env.SHOP_OPEN;
console.log(`build: SHOP_OPEN = ${JSON.stringify(raw)}`);

const html = fs.readFileSync(file, "utf8");
const committed = html.match(/<html\b[^>]*\bdata-shop="([^"]*)"/);

if (!committed) {
  console.error(`build: no data-shop attribute found in ${file}`);
  process.exit(1);
}

if (raw === undefined || raw === "") {
  console.log(`build: SHOP_OPEN not set, keeping committed status "${committed[1]}"`);
  process.exit(0);
}

const status = raw === "false" ? "closed" : "open";
fs.writeFileSync(file, html.replace(/(<html\b[^>]*\bdata-shop=")[^"]*(")/, `$1${status}$2`));
console.log(`build: shop is ${status}`);
