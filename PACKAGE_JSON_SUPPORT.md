# package.json Fallback Support

## Summary

The scanner now supports projects without `package-lock.json` by falling back to scanning `package.json`. However, this provides **LIMITED protection** as it only scans direct dependencies.

## Changes Made

### 1. Enhanced Scanner (`lib/scanner.js`)

**New Features:**
- ✅ Tries `package-lock.json` first (full protection)
- ✅ Falls back to `package.json` if lock file missing
- ✅ Returns metadata about scan type (`isLockFile` flag)
- ✅ Provides warnings when using fallback mode

**New Function:**
```javascript
extractFromPackageJson(packageJson, dependencies)
```
Extracts DIRECT dependencies from:
- `dependencies`
- `devDependencies`
- `optionalDependencies`
- `peerDependencies`

### 2. Updated CLI (`index.js`)

**New Behavior:**
- Displays warnings at the start of scan if using fallback
- Shows scan mode in results: `(including transitive)` vs `(direct only)`
- Reminds users to generate lock file for complete protection

**Warning Output:**
```
⚠️  WARNINGS:

⚠️  No package-lock.json found - scanning DIRECT dependencies only
⚠️  Transitive dependencies (nested dependencies) are NOT scanned
💡 Run "npm install" to generate package-lock.json for complete scan
```

### 3. Documentation

**Created:**
- `TRANSITIVE_DEPENDENCIES.md` - Comprehensive guide on:
  - What transitive dependencies are
  - Why they matter for security
  - Real-world attack scenarios
  - How to ensure complete protection
  - Best practices

**Updated:**
- `README.md` - Added dependency scanning modes table
- Features list - Added "Smart Fallback" feature

## How It Works

### Scenario 1: With package-lock.json ✅

```javascript
// Returns:
{
  dependencies: Map(847) { ... },  // All packages including transitive
  isLockFile: true,
  warnings: []
}
```

**Output:**
```
📦 Total packages scanned: 847 (including transitive)
✅ Great! No vulnerable packages detected
```

### Scenario 2: Without package-lock.json ⚠️

```javascript
// Returns:
{
  dependencies: Map(12) { ... },  // Only direct dependencies
  isLockFile: false,
  warnings: [
    '⚠️  No package-lock.json found - scanning DIRECT dependencies only',
    '⚠️  Transitive dependencies (nested dependencies) are NOT scanned',
    '💡 Run "npm install" to generate package-lock.json for complete scan'
  ]
}
```

**Output:**
```
⚠️  WARNINGS:
⚠️  No package-lock.json found - scanning DIRECT dependencies only
⚠️  Transitive dependencies (nested dependencies) are NOT scanned
💡 Run "npm install" to generate package-lock.json for complete scan

📦 Total packages scanned: 12 (direct only)
⚠️  NOTE: Only DIRECT dependencies were scanned
   For complete protection, generate package-lock.json:
   $ npm install
```

## Limitations of package.json Scanning

### ❌ What's NOT Scanned:

1. **Transitive Dependencies**
   - Dependencies of your dependencies
   - Nested dependency chains
   - The majority of your actual dependencies!

2. **Version Ranges**
   - `package.json` uses ranges: `^4.18.0`, `~2.1.0`
   - `package-lock.json` uses exact versions: `4.18.2`
   - Harder to detect vulnerable versions with ranges

3. **Hidden Malware**
   - Attackers target transitive dependencies
   - These won't be detected in fallback mode

### ⚠️ Security Risk Example:

```
Your package.json:
{
  "dependencies": {
    "express": "^4.18.0"  ← Clean, scan passes ✅
  }
}

Actual installed packages (not scanned in fallback):
express@4.18.0
├─ body-parser@1.20.0
├─ cookie@0.5.0
├─ malicious-package@1.0.0  ← VULNERABLE! But not detected ❌
└─ ... 100+ more packages
```

## Best Practices

### ✅ DO:

1. **Always use package-lock.json in production**
   ```bash
   npm install  # Generates lock file
   git add package-lock.json
   git commit -m "Add package-lock.json"
   ```

2. **Run scanner after installing dependencies**
   ```bash
   npm ci  # In CI/CD
   npx shai-hulud-inspector@latest
   ```

3. **Fail CI/CD if no lock file**
   ```yaml
   - name: Check for lock file
     run: test -f package-lock.json || exit 1
   ```

### ❌ DON'T:

1. Don't rely on package.json scanning for security
2. Don't add package-lock.json to .gitignore
3. Don't delete lock files to fix dependency issues
4. Don't skip npm install in CI/CD

## Testing

### Test With Lock File:
```bash
cd your-project
npm install  # Generates package-lock.json
npx shai-hulud-inspector@latest
```

### Test Without Lock File:
```bash
cd your-project
rm package-lock.json  # Temporarily remove
npx shai-hulud-inspector@latest
# Should show warnings and "direct only" message
```

## FAQ

**Q: Can transitive dependencies contain vulnerabilities even if my direct dependencies are clean?**  
**A:** YES! This is exactly why package-lock.json scanning is critical. Attackers often target transitive dependencies because developers rarely inspect them.

**Q: How many packages does a typical project have?**  
**A:** 
- Direct dependencies (package.json): 10-50 packages
- Total dependencies (package-lock.json): 500-2000+ packages
- **You're missing 95%+ of your dependencies without the lock file!**

**Q: Can I use this scanner without npm install?**  
**A:** Yes, but you'll only get limited (direct dependencies) protection. For complete scanning, run `npm install` first.

**Q: What if my project uses yarn or pnpm?**  
**A:** Currently only npm's `package-lock.json` is supported. Support for `yarn.lock` and `pnpm-lock.yaml` may be added in the future. For now, you can:
```bash
npm install  # Generates package-lock.json alongside yarn.lock
npx shai-hulud-inspector@latest
```

## Technical Details

### Return Value Structure:

```javascript
// extractDependencies() returns:
{
  dependencies: Map<string, Set<string>>,
  isLockFile: boolean,
  warnings: string[]
}

// getAllDependencies() returns:
{
  dependencies: Array<{name: string, versions: string[]}>,
  isLockFile: boolean,
  warnings: string[]
}
```

### Version Handling:

| Source | Example | Format |
|--------|---------|--------|
| package-lock.json | `"version": "4.18.2"` | Exact version |
| package.json | `"express": "^4.18.0"` | Version range |

## Summary

| Feature | package-lock.json | package.json |
|---------|------------------|--------------|
| Scans direct deps | ✅ Yes | ✅ Yes |
| Scans transitive deps | ✅ Yes | ❌ **No** |
| Exact versions | ✅ Yes | ⚠️ Ranges |
| Complete protection | ✅ Yes | ❌ **No** |
| Recommended | ✅ **Yes** | ⚠️ Fallback only |

**Always use package-lock.json for complete security!** 🔒

