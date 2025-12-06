#!/usr/bin/env node

/**
 * Build Readiness Checker
 * Validates that the project is ready for deployment
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

function checkPackageJson() {
  console.log('📦 Checking package.json...');
  
  const packagePath = path.join(rootDir, 'package.json');
  if (!fs.existsSync(packagePath)) {
    console.error('  ❌ package.json not found');
    return false;
  }
  
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
  
  // Check required scripts
  const requiredScripts = ['build', 'dev'];
  const missingScripts = requiredScripts.filter(script => !pkg.scripts[script]);
  
  if (missingScripts.length > 0) {
    console.error(`  ❌ Missing required scripts: ${missingScripts.join(', ')}`);
    return false;
  }
  
  console.log('  ✅ package.json is valid');
  return true;
}

function checkDependencies() {
  console.log('\n📚 Checking dependencies...');
  
  const packagePath = path.join(rootDir, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
  
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  
  // Check for critical dependencies
  const criticalDeps = ['react', 'react-dom', 'vite'];
  const missing = criticalDeps.filter(dep => !deps[dep]);
  
  if (missing.length > 0) {
    console.error(`  ❌ Missing critical dependencies: ${missing.join(', ')}`);
    return false;
  }
  
  console.log('  ✅ All critical dependencies present');
  return true;
}

function checkTypeScript() {
  console.log('\n📝 Checking TypeScript configuration...');
  
  const tsconfigPath = path.join(rootDir, 'tsconfig.json');
  if (!fs.existsSync(tsconfigPath)) {
    console.warn('  ⚠️  tsconfig.json not found');
    return true; // Not fatal
  }
  
  const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'));
  
  // Check for alias configurations (should be removed)
  if (tsconfig.compilerOptions?.paths) {
    console.error('  ❌ Path aliases found in tsconfig.json. Use relative imports only.');
    return false;
  }
  
  console.log('  ✅ TypeScript configuration is clean');
  return true;
}

function checkViteConfig() {
  console.log('\n⚡ Checking Vite configuration...');
  
  const viteConfigPath = path.join(rootDir, 'vite.config.ts');
  if (!fs.existsSync(viteConfigPath)) {
    console.error('  ❌ vite.config.ts not found');
    return false;
  }
  
  const content = fs.readFileSync(viteConfigPath, 'utf-8');
  
  // Check for alias configuration with more robust pattern matching
  const aliasPattern = /resolve\s*:\s*\{[^}]*alias\s*:/;
  if (aliasPattern.test(content)) {
    console.error('  ❌ Alias configuration found in vite.config.ts. Remove it.');
    return false;
  }
  
  console.log('  ✅ Vite configuration is clean');
  return true;
}

function checkBuild() {
  console.log('\n🏗️  Testing build...');
  
  try {
    execSync('npm run build', { 
      cwd: rootDir, 
      stdio: 'pipe',
      encoding: 'utf-8'
    });
    console.log('  ✅ Build successful');
    return true;
  } catch (error) {
    console.error('  ❌ Build failed:');
    console.error(error.stdout || error.stderr);
    return false;
  }
}

function checkEnvironmentVariables() {
  console.log('\n🔐 Checking environment variables...');
  
  // Check for .env.local or warn
  const envPath = path.join(rootDir, '.env.local');
  if (!fs.existsSync(envPath)) {
    console.warn('  ⚠️  .env.local not found. Make sure to set GEMINI_API_KEY for deployment.');
  } else {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    if (!envContent.includes('GEMINI_API_KEY')) {
      console.warn('  ⚠️  GEMINI_API_KEY not found in .env.local');
    } else {
      console.log('  ✅ Environment variables configured');
    }
  }
  
  return true;
}

function main() {
  console.log('🚀 Deployment Readiness Check\n');
  console.log('='.repeat(50) + '\n');
  
  const checks = [
    checkPackageJson,
    checkDependencies,
    checkTypeScript,
    checkViteConfig,
    checkEnvironmentVariables,
    checkBuild,
  ];
  
  const results = checks.map(check => {
    try {
      return check();
    } catch (error) {
      console.error(`  ❌ Check failed: ${error.message}`);
      return false;
    }
  });
  
  console.log('\n' + '='.repeat(50));
  
  const allPassed = results.every(r => r);
  
  if (allPassed) {
    console.log('\n✅ All checks passed! Project is ready for deployment.');
    process.exit(0);
  } else {
    console.log('\n❌ Some checks failed. Please fix the issues before deploying.');
    process.exit(1);
  }
}

main();
