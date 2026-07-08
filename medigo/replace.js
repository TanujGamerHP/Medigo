const fs = require('fs');
const path = require('path');
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}
const files = walk('./src');
let count = 0;
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let newContent = content.replace(/\$(\d+)/g, '₹$1'); // $149 -> ₹149
  newContent = newContent.replace(/\$\$\{/g, '₹${'); // $${price} -> ₹${price}
  newContent = newContent.replace(/>\$\{/g, '>₹{');  // >${price} -> >₹{price} (JSX)
  newContent = newContent.replace(/"\$([^\{])/g, '"₹$1');  // "$100" -> "₹100" (ignores "${var}")
  newContent = newContent.replace(/'\$([^\{])/g, '\'₹$1'); // '$100' -> '₹100'
  newContent = newContent.replace(/ \$([^\{])/g, ' ₹$1');  // ' $100' -> ' ₹100' (ignores " ${var}")

  if (content !== newContent) {
    fs.writeFileSync(f, newContent, 'utf8');
    count++;
  }
});
console.log('Modified ' + count + ' files.');
