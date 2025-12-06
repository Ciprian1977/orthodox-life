#!/bin/bash

# Script to validate that all imports use relative paths only
# This ensures the codebase maintains strict relative imports (./ ../)

set -e

echo "🔍 Validating import statements..."

# Find any imports using the @/ alias
ALIAS_IMPORTS=$(grep -r "from ['\"]@/" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" . 2>/dev/null | grep -v node_modules | grep -v dist || true)

if [ ! -z "$ALIAS_IMPORTS" ]; then
    echo "❌ ERROR: Found imports using @/ alias:"
    echo "$ALIAS_IMPORTS"
    echo ""
    echo "Please use relative imports (./ or ../) instead."
    exit 1
fi

# Check if alias configuration exists in tsconfig.json
if grep -q '"@/\*"' tsconfig.json 2>/dev/null; then
    echo "❌ ERROR: Found @/* alias configuration in tsconfig.json"
    echo "Please remove the paths configuration from tsconfig.json"
    exit 1
fi

# Check if alias configuration exists in vite.config.ts
if grep -q "'@':" vite.config.ts 2>/dev/null || grep -q '"@":' vite.config.ts 2>/dev/null; then
    echo "❌ ERROR: Found @ alias configuration in vite.config.ts"
    echo "Please remove the alias configuration from vite.config.ts"
    exit 1
fi

echo "✅ All imports are using relative paths"
echo "✅ No alias configurations found"
echo "✅ Import validation passed!"
