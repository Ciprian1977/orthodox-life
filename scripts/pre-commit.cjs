#!/usr/bin/env node

/**
 * Pre-commit validation script
 * Runs before commits to ensure code quality
 */

const { execSync } = require('child_process');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

function run(script, name) {
  console.log(`\n🔍 Running ${name}...`);
  try {
    execSync(`node ${script}`, {
      cwd: rootDir,
      stdio: 'inherit',
      encoding: 'utf-8'
    });
    console.log(`✅ ${name} passed\n`);
    return true;
  } catch (error) {
    console.error(`❌ ${name} failed\n`);
    return false;
  }
}

function main() {
  console.log('🚀 Running pre-commit checks...');
  console.log('='.repeat(60));
  
  const checks = [
    { script: path.join(__dirname, 'validate-imports-simple.cjs'), name: 'Import validation' },
  ];
  
  const results = checks.map(({ script, name }) => run(script, name));
  
  console.log('='.repeat(60));
  
  if (results.every(r => r)) {
    console.log('\n✅ All pre-commit checks passed!\n');
    process.exit(0);
  } else {
    console.log('\n❌ Some pre-commit checks failed. Please fix before committing.\n');
    process.exit(1);
  }
}

main();
