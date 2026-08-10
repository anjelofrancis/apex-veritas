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
    } else {
      if (file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.css')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('./src');
let changedCount = 0;
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const originalContent = content;
  
  content = content.replace(/bg-navy/g, 'bg-background');
  content = content.replace(/border-border/g, 'border-divider');
  content = content.replace(/border-white\/10/g, 'border-divider');
  content = content.replace(/bg-\[#0A0F1C\]/g, 'bg-background');
  
  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    changedCount++;
    console.log('Modified: ' + file);
  }
});
console.log('Changed files: ' + changedCount);
