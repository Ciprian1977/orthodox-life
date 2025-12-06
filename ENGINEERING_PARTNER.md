# Engineering Partner Documentation

This document describes the automated tooling and processes for maintaining a clean, stable, and deployable codebase for the "viața-ortodoxă" project.

## Overview

The project has been configured with automated validation tools to ensure:
- Clean relative imports only (no aliases like `@/`)
- No security vulnerabilities in dependencies
- Build readiness for Vercel deployment
- Code quality and consistency

## Architecture Decisions

### Import System
- **Strict relative imports**: All imports use `./` or `../` paths
- **No alias configuration**: Removed `@/` from `tsconfig.json` and `vite.config.ts`
- **Automatic validation**: Scripts check for forbidden import patterns

### Validation Scripts

All validation scripts are located in the `scripts/` directory and can be run via npm commands.

#### 1. Import Validation
```bash
npm run validate:imports
```

**Purpose**: Ensures all imports use relative paths only  
**Checks**:
- No `@/` alias imports
- No `~/` alias imports
- Warns about broken imports

**Example output**:
```
✅ All imports are valid! No alias imports found.
```

#### 2. Security Check
```bash
npm run validate:security
```

**Purpose**: Checks for package vulnerabilities and outdated dependencies  
**Checks**:
- Critical/high vulnerabilities via `npm audit`
- Outdated packages
- Provides update recommendations

**Example output**:
```
📊 Vulnerability Summary:
   Critical: 0
   High:     0
   Moderate: 0
   Low:      0

✅ Security check passed.
```

#### 3. Deployment Readiness
```bash
npm run validate:deployment
```

**Purpose**: Validates project is ready for Vercel deployment  
**Checks**:
- `package.json` validity
- Critical dependencies present
- TypeScript configuration (no aliases)
- Vite configuration (no aliases)
- Environment variables
- Build success

**Example output**:
```
✅ All checks passed! Project is ready for deployment.
```

#### 4. Run All Validations
```bash
npm run validate:all
```

Runs all validation scripts in sequence.

## Pre-commit Workflow

Before committing code changes:

```bash
npm run precommit
```

This runs essential checks to prevent broken builds.

## Integration with Gemini from Google AI Studio

### Workflow

1. **Monitor Gemini changes**: After Gemini modifies files, run validation:
   ```bash
   npm run validate:all
   ```

2. **Auto-fix imports**: If Gemini creates alias imports, they will be detected:
   ```bash
   npm run validate:imports
   ```

3. **Before deployment**: Always run:
   ```bash
   npm run validate:deployment
   ```

### Common Gemini Scenarios

#### Scenario 1: Gemini moves a file
1. Gemini moves `components/Button.tsx` → `components/ui/Button.tsx`
2. Run `npm run validate:imports` to detect broken imports
3. Fix imports manually or ask Gemini to update them
4. Re-run validation

#### Scenario 2: Gemini adds new dependencies
1. Gemini adds a new npm package
2. Run `npm run validate:security` to check for vulnerabilities
3. If issues found, ask Gemini to use a different package or update

#### Scenario 3: Gemini restructures directories
1. Gemini reorganizes folder structure
2. Run `npm run validate:all` to catch all issues
3. Fix any broken imports
4. Verify build succeeds

## Vercel Deployment

### Environment Variables
Set in Vercel dashboard:
- `GEMINI_API_KEY`: Your Google Gemini API key

### Build Configuration
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Pre-deployment Checklist
- [ ] Run `npm run validate:all`
- [ ] Ensure `GEMINI_API_KEY` is set in Vercel
- [ ] Test build locally: `npm run build`
- [ ] Preview changes: `npm run preview`

## Troubleshooting

### Import Errors
**Problem**: Build fails with module resolution errors  
**Solution**: 
1. Run `npm run validate:imports`
2. Check the error output
3. Update imports to use relative paths

### Security Vulnerabilities
**Problem**: Security check fails  
**Solution**:
1. Run `npm audit` for details
2. Try `npm audit fix` for automatic fixes
3. Update packages manually if needed
4. Re-run `npm run validate:security`

### Build Failures
**Problem**: Build fails unexpectedly  
**Solution**:
1. Run `npm run validate:deployment`
2. Check each step's output
3. Fix configuration issues
4. Clear cache: `rm -rf node_modules package-lock.json && npm install`

## Maintenance

### Regular Tasks
- **Weekly**: Run `npm run validate:security` to check for vulnerabilities
- **Before commits**: Run `npm run precommit`
- **Before deployments**: Run `npm run validate:all`

### Package Updates
```bash
# Check for updates
npm outdated

# Update packages
npm update

# Re-run security check
npm run validate:security
```

## Script Details

### validate-imports-simple.cjs
Scans all TypeScript/JavaScript files for forbidden import patterns.

### check-security.cjs
Uses `npm audit` to check for vulnerabilities and lists outdated packages.

### check-deployment.cjs
Comprehensive deployment readiness check including config validation and build test.

### pre-commit.cjs
Lightweight pre-commit validation to catch issues before they're committed.

## Best Practices

1. **Always use relative imports**: `./components/Button` not `@/components/Button`
2. **Run validations frequently**: Catch issues early
3. **Keep dependencies updated**: Run security checks weekly
4. **Test builds locally**: Before pushing to production
5. **Document changes**: Update this file when adding new validations

## Future Enhancements

Potential additions:
- [ ] Automated import path rewriting when files move
- [ ] Git hooks for automatic pre-commit validation
- [ ] CI/CD pipeline integration
- [ ] Automated dependency updates (Dependabot)
- [ ] TypeScript strict mode enforcement
- [ ] ESLint/Prettier integration
- [ ] Component usage tracking (detect unused components)
- [ ] Translation file validation (Romanian-only logic)

## Support

For issues or questions about the engineering partner setup:
1. Check this documentation
2. Review script output for specific errors
3. Run validation scripts for diagnostics
4. Check package.json for script definitions
