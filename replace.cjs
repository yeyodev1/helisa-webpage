const fs = require('fs');
const path = require('path');

const walk = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.vue') || file.endsWith('.scss')) {
      results.push(file);
    }
  });
  return results;
};

const files = walk('./src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Exact string replacements to safely replace $black with $primary
  // This will surgically target styles applying the $black variable (which was the monochrome core).
  content = content.split('background: $black;').join('background: $primary;');
  content = content.split('background-color: $black;').join('background-color: $primary;');
  content = content.split('color: $black;').join('color: $primary;');
  content = content.split('border-color: $black;').join('border-color: $primary;');
  content = content.split('border: 1px solid $black;').join('border: 1px solid $primary;');
  content = content.split('border: 2px solid $black;').join('border: 2px solid $primary;');
  content = content.split('outline: 2px solid $black;').join('outline: 2px solid $primary;');

  // Adjust hover states to use the dark version if the base became primary
  content = content.split('background: $primary;').map((part, index, array) => {
    if (index === array.length - 1) return part;
    // If this replacement happened inside a hover block, we could use primary-dark.
    // For simplicity, we can do a second pass for typical hover patterns.
    return part + 'background: $primary;';
  }).join('');
  
  // Custom button hover state overrides (since they often look like `&:hover { background: $primary; }`)
  content = content.split('&:hover {\n      background: $primary;\n    }').join('&:hover {\n      background: $primary-dark;\n    }');
  content = content.split('&:hover {\n    background: $primary;\n    transform').join('&:hover {\n    background: $primary-dark;\n    transform');
  content = content.split('&:hover {\n      background: $gray-800;').join('&:hover {\n      background: $primary-dark;');
  
  if(content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated: ' + file);
  }
});
console.log('Done.');
