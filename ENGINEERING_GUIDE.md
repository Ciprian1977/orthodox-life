# Engineering Partner Guide - Viața Ortodoxă

This document serves as the operational guide for maintaining code quality, stability, and deployment readiness for the Orthodox Life (Viața Ortodoxă) project.

## 🎯 Core Objectives

### 1. Code Quality & Standards

#### Import Management
- **STRICT RULE**: All imports MUST use relative paths (`./` or `../`)
- **FORBIDDEN**: Path aliases (e.g., `@/`) are not allowed
- **Validation**: Automatic validation runs before every build via `npm run validate:imports`
- **Configuration**: No alias configuration in `tsconfig.json` or `vite.config.ts`

#### Import Validation
```bash
# Manual validation
npm run validate:imports

# Automatic validation (runs before build)
npm run build
```

### 2. Build & Deployment

#### Build Commands
```bash
# Development server
npm run dev

# Production build (includes import validation)
npm run build

# Preview production build
npm run preview
```

#### Build Checklist
- ✅ Import validation passes
- ✅ TypeScript compilation succeeds
- ✅ No console errors
- ✅ All relative imports are correctly resolved
- ✅ Build artifacts are generated in `dist/`

### 3. Project Structure

```
orthodox-life/
├── components/         # React components
├── contexts/          # React contexts (Theme, User, I18n)
├── i18n/             # Translation files
├── pages/            # Page components
├── scripts/          # Maintenance scripts
├── services/         # Business logic & API services
├── App.tsx           # Root component
├── index.tsx         # Entry point
├── types.ts          # TypeScript type definitions
├── constants.ts      # App constants
└── vite.config.ts    # Vite configuration
```

### 4. Language Support

Currently the project supports 5 languages:
- Romanian (ro) - Primary language
- English (en)
- Russian (ru)
- Greek (el)
- Serbian (sr)

**Note**: While the initial request mentioned Romanian-only, the current implementation supports multiple languages. If Romanian-only is required, this should be discussed with the team before making changes.

### 5. Synchronization with Gemini AI

When Gemini AI makes changes:

1. **Monitor commits** for structural changes
2. **Validate imports** immediately after changes
3. **Run build** to ensure no breakage
4. **Check for**:
   - New files with incorrect import patterns
   - Moved files that might break existing imports
   - Deleted files that might leave broken references

### 6. Common Issues & Fixes

#### Issue: Import using @/ alias detected
```bash
# Run validation to find the issue
npm run validate:imports

# Fix: Replace @/ with relative path
# Before: import { Component } from '@/components/Component'
# After:  import { Component } from './components/Component'
```

#### Issue: Build fails after file restructuring
```bash
# 1. Check for broken imports
grep -r "from ['\"]\.\./" --include="*.ts" --include="*.tsx"

# 2. Verify paths are correct relative to each file
# 3. Run build to confirm fix
npm run build
```

#### Issue: New alias configuration added
```bash
# Remove from tsconfig.json:
# Delete "paths" configuration

# Remove from vite.config.ts:
# Delete "resolve.alias" configuration

# Verify with validation
npm run validate:imports
```

### 7. Deployment to Vercel

#### Pre-deployment Checklist
- [ ] All imports use relative paths
- [ ] Build completes successfully
- [ ] No TypeScript errors
- [ ] Environment variables configured (GEMINI_API_KEY)
- [ ] Dependencies are up to date
- [ ] No security vulnerabilities

#### Vercel Configuration
The project uses Vite for building. Vercel should detect this automatically.

**Build Settings**:
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

**Environment Variables**:
- `GEMINI_API_KEY`: Required for AI features

### 8. Dependency Management

#### Current Stack
- React 19.2.0
- React Router 7.9.6
- Vite 6.2.0
- TypeScript 5.8.2
- Google GenAI 1.30.0
- Lucide React 0.555.0

#### Updating Dependencies
```bash
# Check for updates
npm outdated

# Update all dependencies
npm update

# Update specific dependency
npm install <package>@latest

# Always test after updates
npm run build
```

#### Security Checks
```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

### 9. Code Review Guidelines

When reviewing Gemini's code:
1. Check import statements first
2. Verify file structure changes
3. Run build to catch early errors
4. Look for unused imports or components
5. Ensure code follows existing patterns

### 10. Automated Safeguards

The project includes automated safeguards:

1. **Pre-build validation**: Validates imports before every build
2. **TypeScript strict checking**: Catches type errors at compile time
3. **Vite build optimization**: Ensures production-ready output

## 🚨 Emergency Procedures

### Build Breaking on Vercel
1. Check build logs for specific error
2. Reproduce locally with `npm run build`
3. Fix import issues first (most common)
4. Check for missing environment variables
5. Verify all dependencies are in package.json

### Imports Suddenly Broken
1. Run `npm run validate:imports`
2. Check recent commits for file moves/renames
3. Use relative path from current file to target
4. Update all references to moved/renamed files

## 📋 Maintenance Tasks

### Weekly
- [ ] Check for dependency updates
- [ ] Run security audit
- [ ] Verify build still works

### After Gemini Changes
- [ ] Run import validation
- [ ] Run build
- [ ] Check for new unused files
- [ ] Verify no broken references

### Before Deployment
- [ ] Full build test
- [ ] Import validation
- [ ] Security audit
- [ ] Environment variable check

## 🔧 Scripts Reference

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production (includes validation) |
| `npm run preview` | Preview production build |
| `npm run validate:imports` | Validate import statements |

## 📝 Notes

- This is a Vite-based React application
- Uses React Router for navigation
- Implements i18n for multi-language support
- Integrates with Google Gemini AI for intelligent features
- Designed for mobile-first experience
- Optimized for Vercel deployment

---

**Last Updated**: 2025-12-06
**Maintained By**: Senior Engineering Partner
