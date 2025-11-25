# Quick Publishing Guide - TL;DR

## 🚀 Publish to npm in 5 Steps

### 1. Login to npm
```bash
npm login
```

### 2. Test Locally
```bash
npm test
npm pack --dry-run
```

### 3. Update Repository URLs (if you have a GitHub repo)
Edit `package.json` and replace `yourusername` with your actual GitHub username:
```json
"repository": {
  "type": "git",
  "url": "https://github.com/YOUR-USERNAME/shai-hulud-inspector.git"
}
```

### 4. Publish
```bash
npm publish
```

### 5. Test It Works
```bash
npx shai-hulud-inspector
```

## ✅ That's it! Now anyone can use:

```bash
# Run without installing (recommended - always gets latest)
npx shai-hulud-inspector@latest

# Or without @latest (caches version)
npx shai-hulud-inspector

# Or install globally
npm install -g shai-hulud-inspector
shai-hulud-inspector
```

## 🔄 Publishing Updates

```bash
npm version patch    # 1.0.0 → 1.0.1
npm publish
git push --tags
```

## 🆘 If Name is Taken

Use a scoped package:
```bash
# Update package.json name to:
"name": "@your-username/shai-hulud-inspector"

# Then publish with:
npm publish --access public
```

## 📦 What Gets Published

The `files` field in package.json controls what's included:
- ✅ index.js (main CLI)
- ✅ lib/ (scanner & checker modules)
- ✅ artifacts/ (vulnerable packages database)
- ✅ README.md
- ✅ LICENSE
- ❌ test/ (excluded)
- ❌ examples/ (excluded)

## 🎯 Current Package Status

- ✅ `bin` field configured for CLI access
- ✅ Shebang in index.js (`#!/usr/bin/env node`)
- ✅ All dependencies specified
- ✅ Tests included
- ✅ LICENSE file added
- ✅ PRIVACY.md included (zero data collection policy)
- ✅ .npmignore configured
- ✅ Keywords for discoverability
- ✅ Privacy notice in CLI output

**You're ready to publish!** 🎉

