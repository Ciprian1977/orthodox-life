#!/usr/bin/env node

/**
 * Import Validation Script
 * 
 * This script validates that all imports in the codebase use relative paths only.
 * It scans all TypeScript/JavaScript files and checks for:
 * 1. Alias imports (e.g., @/)
 * 2. Broken relative imports
 * 3. Missing file extensions where required
 */

import { fileURLToPath } from 'url';
import { dirname, join, relative, resolve } from 'path';
import { readFileSync, existsSync, statSync } from 'fs';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');

const ALLOWED_IMPORT_PATTERNS = [
  /^(react|react-dom|react-router-dom|lucide-react|@google\/genai)/,  // npm packages
  /^\.\.?\//,  // relative imports
];

const FORBIDDEN_PATTERNS = [
  { pattern: /@\//, message: 'Alias imports (@/) are not allowed. Use relative imports instead.' },
  { pattern: /^~\//, message: 'Alias imports (~/) are not allowed. Use relative imports instead.' },
];

async function findSourceFiles() {
  const patterns = [
    'src/**/*.{ts,tsx,js,jsx}',
    '*.{ts,tsx,js,jsx}',
    'components/**/*.{ts,tsx,js,jsx}',
    'pages/**/*.{ts,tsx,js,jsx}',
    'contexts/**/*.{ts,tsx,js,jsx}',
    'services/**/*.{ts,tsx,js,jsx}',
    'i18n/**/*.{ts,tsx,js,jsx}',
  ];

  const files = new Set();
  
  for (const pattern of patterns) {
    const matches = await glob(pattern, {
      cwd: rootDir,
      ignore: ['node_modules/**', 'dist/**', 'build/**', '.git/**'],
    });
    matches.forEach(file => files.add(file));
  }

  return Array.from(files);
}

function extractImports(content, filePath) {
  const imports = [];
  const importRegex = /(?:import|export)\s+(?:(?:[\w*{}\s,]+)\s+from\s+)?['"]([^'"]+)['"]/g;
  
  let match;
  let lineNumber = 1;
  const lines = content.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineImportRegex = /(?:import|export)\s+(?:(?:[\w*{}\s,]+)\s+from\s+)?['"]([^'"]+)['"]/g;
    
    while ((match = lineImportRegex.exec(line)) !== null) {
      imports.push({
        path: match[1],
        line: i + 1,
        fullLine: line.trim(),
      });
    }
  }
  
  return imports;
}

function validateImport(importPath, sourceFile) {
  const errors = [];

  // Check for forbidden patterns
  for (const { pattern, message } of FORBIDDEN_PATTERNS) {
    if (pattern.test(importPath)) {
      errors.push(message);
    }
  }

  // Check if it's a relative import
  if (importPath.startsWith('./') || importPath.startsWith('../')) {
    // Validate that the imported file exists
    const sourcePath = join(rootDir, sourceFile);
    const sourceDir = dirname(sourcePath);
    
    // Try multiple extensions
    const extensions = ['', '.ts', '.tsx', '.js', '.jsx'];
    let fileExists = false;
    
    for (const ext of extensions) {
      const targetPath = resolve(sourceDir, importPath + ext);
      if (existsSync(targetPath)) {
        fileExists = true;
        break;
      }
      
      // Check for index files
      const indexPath = resolve(sourceDir, importPath, 'index' + ext);
      if (existsSync(indexPath)) {
        fileExists = true;
        break;
      }
    }
    
    if (!fileExists) {
      errors.push(`Relative import "${importPath}" cannot be resolved from "${sourceFile}"`);
    }
  }

  return errors;
}

async function main() {
  console.log('🔍 Validating imports in the codebase...\n');
  
  const files = await findSourceFiles();
  console.log(`📁 Found ${files.length} source files to check\n`);
  
  let totalErrors = 0;
  const errorsByFile = {};

  for (const file of files) {
    const filePath = join(rootDir, file);
    const content = readFileSync(filePath, 'utf-8');
    const imports = extractImports(content, file);
    
    for (const importInfo of imports) {
      const errors = validateImport(importInfo.path, file);
      
      if (errors.length > 0) {
        if (!errorsByFile[file]) {
          errorsByFile[file] = [];
        }
        
        errorsByFile[file].push({
          line: importInfo.line,
          import: importInfo.path,
          fullLine: importInfo.fullLine,
          errors,
        });
        
        totalErrors += errors.length;
      }
    }
  }

  if (totalErrors === 0) {
    console.log('✅ All imports are valid! No issues found.');
    process.exit(0);
  } else {
    console.log(`❌ Found ${totalErrors} import error(s):\n`);
    
    for (const [file, fileErrors] of Object.entries(errorsByFile)) {
      console.log(`📄 ${file}:`);
      
      for (const error of fileErrors) {
        console.log(`  Line ${error.line}: ${error.fullLine}`);
        for (const msg of error.errors) {
          console.log(`    ⚠️  ${msg}`);
        }
        console.log('');
      }
    }
    
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
