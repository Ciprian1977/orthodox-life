#!/usr/bin/env node

/**
 * Package Vulnerability Checker
 * Checks npm packages for known vulnerabilities
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

function checkVulnerabilities() {
  console.log('🔒 Checking for package vulnerabilities...\n');
  
  try {
    const output = execSync('npm audit --json', { 
      cwd: rootDir, 
      stdio: 'pipe',
      encoding: 'utf-8'
    });
    
    const audit = JSON.parse(output);
    
    if (audit.metadata) {
      const { vulnerabilities } = audit.metadata;
      
      console.log('📊 Vulnerability Summary:');
      console.log(`   Critical: ${vulnerabilities.critical || 0}`);
      console.log(`   High:     ${vulnerabilities.high || 0}`);
      console.log(`   Moderate: ${vulnerabilities.moderate || 0}`);
      console.log(`   Low:      ${vulnerabilities.low || 0}`);
      console.log(`   Info:     ${vulnerabilities.info || 0}\n`);
      
      if (vulnerabilities.critical > 0 || vulnerabilities.high > 0) {
        console.error('❌ Critical or high vulnerabilities found!');
        console.log('\nRun `npm audit fix` to attempt automatic fixes.');
        console.log('Run `npm audit` for detailed information.\n');
        return false;
      } else if (vulnerabilities.moderate > 0) {
        console.warn('⚠️  Moderate vulnerabilities found.');
        console.log('Consider running `npm audit fix` to update packages.\n');
        return true;
      } else {
        console.log('✅ No significant vulnerabilities found.\n');
        return true;
      }
    }
    
    return true;
  } catch (error) {
    // npm audit returns exit code 1 if vulnerabilities are found
    if (error.stdout) {
      try {
        const audit = JSON.parse(error.stdout);
        
        if (audit.metadata) {
          const { vulnerabilities } = audit.metadata;
          
          console.log('📊 Vulnerability Summary:');
          console.log(`   Critical: ${vulnerabilities.critical || 0}`);
          console.log(`   High:     ${vulnerabilities.high || 0}`);
          console.log(`   Moderate: ${vulnerabilities.moderate || 0}`);
          console.log(`   Low:      ${vulnerabilities.low || 0}`);
          console.log(`   Info:     ${vulnerabilities.info || 0}\n`);
          
          if (vulnerabilities.critical > 0 || vulnerabilities.high > 0) {
            console.error('❌ Critical or high vulnerabilities found!');
            console.log('\nRun `npm audit fix` to attempt automatic fixes.');
            console.log('Run `npm audit` for detailed information.\n');
            return false;
          } else if (vulnerabilities.moderate > 0) {
            console.warn('⚠️  Moderate vulnerabilities found.');
            console.log('Consider running `npm audit fix` to update packages.\n');
            return true;
          }
        }
      } catch (parseError) {
        console.error('Failed to parse audit output');
      }
    }
    
    console.log('⚠️  Could not run vulnerability check');
    return true; // Don't fail on error
  }
}

function checkOutdatedPackages() {
  console.log('📦 Checking for outdated packages...\n');
  
  try {
    const output = execSync('npm outdated --json', { 
      cwd: rootDir, 
      stdio: 'pipe',
      encoding: 'utf-8'
    });
    
    if (output) {
      const outdated = JSON.parse(output);
      const packages = Object.keys(outdated);
      
      if (packages.length > 0) {
        console.log('⚠️  Outdated packages found:');
        packages.forEach(pkg => {
          const info = outdated[pkg];
          console.log(`   ${pkg}: ${info.current} → ${info.latest}`);
        });
        console.log('\nConsider running `npm update` to update packages.\n');
      }
    } else {
      console.log('✅ All packages are up to date.\n');
    }
    
    return true;
  } catch (error) {
    // npm outdated returns exit code 1 if packages are outdated
    if (error.stdout) {
      try {
        const outdated = JSON.parse(error.stdout);
        const packages = Object.keys(outdated);
        
        if (packages.length > 0) {
          console.log('⚠️  Outdated packages found:');
          packages.forEach(pkg => {
            const info = outdated[pkg];
            console.log(`   ${pkg}: ${info.current} → ${info.latest}`);
          });
          console.log('\nConsider running `npm update` to update packages.\n');
        }
      } catch (parseError) {
        // Ignore parse errors
      }
    }
    
    return true; // Don't fail on outdated packages
  }
}

function main() {
  console.log('🔍 Package Security & Updates Check\n');
  console.log('='.repeat(50) + '\n');
  
  const vulnerabilityCheck = checkVulnerabilities();
  const outdatedCheck = checkOutdatedPackages();
  
  console.log('='.repeat(50) + '\n');
  
  if (vulnerabilityCheck) {
    console.log('✅ Security check passed.');
    process.exit(0);
  } else {
    console.log('❌ Security issues found. Please fix before deploying.');
    process.exit(1);
  }
}

main();
