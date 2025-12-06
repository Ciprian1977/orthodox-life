<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1U1OQYTaonmCE7WcGkU9t1bL7SwE2TiOK

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Engineering Partner Setup

This project includes automated validation tools for maintaining code quality:

- **Import validation**: Ensures all imports use relative paths only (no aliases)
- **Security checking**: Scans for package vulnerabilities
- **Deployment readiness**: Validates configuration for Vercel deployment

### Quick Commands

```bash
# Validate imports
npm run validate:imports

# Check security
npm run validate:security

# Check deployment readiness
npm run validate:deployment

# Run all validations
npm run validate:all

# Pre-commit checks
npm run precommit
```

For detailed documentation, see [ENGINEERING_PARTNER.md](./ENGINEERING_PARTNER.md).

## Code Standards

- ✅ Use relative imports (`./` or `../`) only
- ❌ No alias imports (`@/` or `~/`)
- ✅ Run validation scripts before committing
- ✅ Keep dependencies updated and secure
