const fs = require('fs');
const path = require('path');

function convertToUnixLineEndings(content) {
  // First convert Windows line endings (\r\n) to Unix (\n)
  content = content.replace(/\r\n/g, '\n');
  // Then convert any remaining Mac line endings (\r) to Unix (\n)
  content = content.replace(/\r/g, '\n');
  // Finally ensure no double line endings
  content = content.replace(/\n\n+/g, '\n\n');
  return content;
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (file.endsWith('.py')) {
      console.log(`Processing: ${filePath}`);
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const converted = convertToUnixLineEndings(content);
        fs.writeFileSync(filePath, converted, { encoding: 'utf8' });
        console.log(`✓ Converted line endings in: ${filePath}`);
      } catch (err) {
        console.error(`Error processing ${filePath}:`, err);
      }
    }
  });
}

console.log('Converting Python files to Unix line endings...\n');
walkDir('server_config');
console.log('\nConversion complete!');