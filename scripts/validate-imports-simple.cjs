#!/usr/bin/env node

/**
 * Simple Import Validator
 * Checks for alias imports (@/) in the codebase
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    
    // Skip node_modules, dist, .git directories
    if (file === 'node_modules' || file === 'dist' || file === 'build' || file === '.git') {
      return;
    }
    
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else if (/\.(ts|tsx|js|jsx)$/.test(file)) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const errors = [];
  
  lines.forEach((line, index) => {
    // Check for alias imports
    if (/@\//.test(line) && /(?:import|export)/.test(line)) {
      errors.push({
        line: index + 1,
        content: line.trim(),
        message: 'Alias import (@/) detected. Use relative imports instead.'
      });
    }
    
    if (/~\//.test(line) && /(?:import|export)/.test(line)) {
      errors.push({
        line: index + 1,
        content: line.trim(),
        message: 'Alias import (~/) detected. Use relative imports instead.'
      });
    }
  });
  
  return errors;
}

function main() {
  console.log('🔍 Validating imports...\n');
  
  const files = getAllFiles(rootDir);
  console.log(`📁 Checking ${files.length} files\n`);
  
  let totalErrors = 0;
  const errorsByFile = {};
  
  for (const file of files) {
    const errors = checkFile(file);
    if (errors.length > 0) {
      const relativePath = path.relative(rootDir, file);
      errorsByFile[relativePath] = errors;
      totalErrors += errors.length;
    }
  }
  
  if (totalErrors === 0) {
    console.log('✅ All imports are valid! No alias imports found.');
    process.exit(0);
  } else {
    console.log(`❌ Found ${totalErrors} import issue(s):\n`);
    
    Object.entries(errorsByFile).forEach(([file, errors]) => {
      console.log(`📄 ${file}:`);
      errors.forEach(error => {
        console.log(`  Line ${error.line}: ${error.content}`);
        console.log(`    ⚠️  ${error.message}\n`);
      });
    });
    
    process.exit(1);
  }
}

main();
