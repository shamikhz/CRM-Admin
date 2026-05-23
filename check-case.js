const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      if (!file.includes('node_modules') && !file.includes('.next') && !file.includes('.git')) {
        results = results.concat(walk(file));
      }
    } else { 
      if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('./src');
let issues = [];

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const importRegex = /import\s+.*?from\s+['"](.*?)['"]/g;
  let match;
  
  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1];
    
    if (importPath.startsWith('@/')) {
      const realPath = path.join(__dirname, 'src', importPath.substring(2));
      
      const ext = ['.tsx', '.ts', '.js', '.jsx', '/index.tsx', '/index.ts', ''].find(e => {
        const p = realPath + e;
        if (fs.existsSync(p)) {
          // Check exact case
          const dir = path.dirname(p);
          const base = path.basename(p);
          const actualFiles = fs.readdirSync(dir);
          return actualFiles.includes(base);
        }
        return false;
      });
      
      if (ext === undefined) {
         // Check if it exists with different case
         const dir = path.dirname(realPath);
         if (fs.existsSync(dir)) {
           const base = path.basename(realPath);
           const actualFiles = fs.readdirSync(dir);
           const wrongCase = actualFiles.find(f => {
              const strippedF = f.replace(/\.(tsx|ts|jsx|js)$/, '');
              return strippedF.toLowerCase() === base.toLowerCase();
           });
           
           if (wrongCase) {
             issues.push({file, importPath, expected: wrongCase});
           }
         }
      }
    }
  }
});

console.log(issues.length ? JSON.stringify(issues, null, 2) : 'No case issues found.');
