# Publishing Shai Hulud Inspector to npm

This guide walks you through publishing the package to npm and making it available via `npx`.

## Prerequisites

### 1. Create an npm Account

If you don't have an npm account yet:

1. Go to [npmjs.com](https://www.npmjs.com/signup)
2. Create an account
3. Verify your email address

### 2. Login to npm CLI

```bash
npm login
```

Enter your:
- Username
- Password
- Email
- One-time password (if 2FA is enabled)

Verify you're logged in:
```bash
npm whoami
```

## Pre-Publishing Checklist

### 1. Check Package Name Availability

```bash
npm search shai-hulud-inspector
```

If the name is taken, you have options:
- Use a scoped package: `@your-username/shai-hulud-inspector`
- Choose a different name: `shai-hulud-scan`, `shai-hulud-checker`, etc.

### 2. Update package.json

The current package.json is already configured correctly with:
- ✅ `"bin"` field for CLI access
- ✅ `"main"` field for programmatic use
- ✅ Keywords for discoverability
- ✅ Dependencies specified

### 3. Test Locally Before Publishing

Test the package as if it were installed globally:

```bash
# Link the package locally
npm link

# Test the command
shai-hulud-inspector

# Test with npx
npx shai-hulud-inspector

# Unlink when done testing
npm unlink -g shai-hulud-inspector
```

### 4. Add Files to Include/Exclude

Create or verify `.npmignore`:

```bash
# .npmignore
test/
examples/
*.md
!README.md
.git
.gitignore
node_modules/
```

Or use `"files"` field in package.json (recommended):

```json
"files": [
  "index.js",
  "lib/",
  "artifacts/"
]
```

## Publishing Steps

### Step 1: Ensure Everything is Ready

```bash
# Run tests
npm test

# Check what will be published
npm pack --dry-run
```

### Step 2: Update Version (if needed)

```bash
# First publish: already at 1.0.0
# For updates:
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0
npm version major  # 1.0.0 -> 2.0.0
```

### Step 3: Publish to npm

```bash
# First time publish
npm publish

# If using a scoped package
npm publish --access public
```

### Step 4: Verify Publication

```bash
# Check on npm
npm view shai-hulud-inspector

# Test with npx (most common usage)
npx shai-hulud-inspector@latest

# Verify it scans properly
npx shai-hulud-inspector@latest .
```

## Using the Published Package

### With npx (No Installation)

```bash
# Run once without installing
npx shai-hulud-inspector

# Run on a specific project
npx shai-hulud-inspector /path/to/project

# Use specific version
npx shai-hulud-inspector@1.0.0
```

### With Global Installation

```bash
# Install globally
npm install -g shai-hulud-inspector

# Run anywhere
shai-hulud-inspector
```

### As a Project Dependency

```bash
# Install in a project
npm install --save-dev shai-hulud-inspector

# Add to package.json scripts
"scripts": {
  "security:scan": "shai-hulud-inspector"
}

# Run via npm
npm run security:scan
```

## Post-Publishing Tasks

### 1. Tag the Release on Git

```bash
git tag v1.0.0
git push origin v1.0.0
```

### 2. Create a GitHub Release

1. Go to your GitHub repository
2. Click "Releases" → "Create a new release"
3. Select the tag you just created
4. Add release notes

### 3. Update README Badge

Add npm version and downloads badges to README.md:

```markdown
[![npm version](https://badge.fury.io/js/shai-hulud-inspector.svg)](https://www.npmjs.com/package/shai-hulud-inspector)
[![npm downloads](https://img.shields.io/npm/dm/shai-hulud-inspector.svg)](https://www.npmjs.com/package/shai-hulud-inspector)
```

## Publishing Updates

When you make changes:

```bash
# 1. Make your changes
# 2. Update version
npm version patch

# 3. Commit changes
git add .
git commit -m "Release v1.0.1"

# 4. Publish
npm publish

# 5. Push to git
git push
git push --tags
```

## Automated Publishing with CI/CD

### GitHub Actions Example

Create `.github/workflows/publish.yml`:

```yaml
name: Publish to npm

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      
      - name: Install dependencies
        run: npm install
      
      - name: Run tests
        run: npm test
      
      - name: Publish to npm
        run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

Then add `NPM_TOKEN` to GitHub Secrets:
1. Generate token at npmjs.com → Settings → Access Tokens
2. Add to GitHub repo → Settings → Secrets → New repository secret

## Troubleshooting

### Error: Package name already taken

**Solution**: Use a scoped package name

Update package.json:
```json
{
  "name": "@your-username/shai-hulud-inspector"
}
```

Then publish with:
```bash
npm publish --access public
```

### Error: You must verify your email

**Solution**: Check your email and click the verification link from npm

### Error: EPERM or permission denied

**Solution**: 
```bash
# Make sure index.js is executable
chmod +x index.js

# Re-run npm publish
npm publish
```

### Package works locally but not after publishing

**Solution**: Check that all required files are included

```bash
# See what files will be published
npm pack --dry-run

# Make sure artifacts/ and lib/ directories are included
```

## Best Practices

1. **Semantic Versioning**: Follow semver (major.minor.patch)
2. **Changelog**: Maintain a CHANGELOG.md file
3. **Tests**: Always run tests before publishing
4. **Git Tags**: Tag releases in git
5. **Documentation**: Keep README.md up to date
6. **License**: Ensure LICENSE file is included
7. **Security**: Enable 2FA on your npm account

## npm Package Optimization

### Add Badges to README

```markdown
[![npm](https://img.shields.io/npm/v/shai-hulud-inspector)](https://www.npmjs.com/package/shai-hulud-inspector)
[![downloads](https://img.shields.io/npm/dt/shai-hulud-inspector)](https://www.npmjs.com/package/shai-hulud-inspector)
[![license](https://img.shields.io/npm/l/shai-hulud-inspector)](https://github.com/yourusername/shai-hulud-inspector/blob/main/LICENSE)
```

### Keywords for Discoverability

Already included in package.json:
- shai-hulud
- vulnerabilities
- security
- npm
- dependency-scanner

## Maintenance

### Unpublishing (if needed)

```bash
# Unpublish a specific version (within 72 hours)
npm unpublish shai-hulud-inspector@1.0.0

# Deprecate instead (recommended)
npm deprecate shai-hulud-inspector@1.0.0 "Use version 1.0.1 instead"
```

### Updating Vulnerable Packages Database

When the Shai Hulud database is updated:

```bash
# 1. Update artifacts/node/shai-hulud-2-packages.json
# 2. Update version
npm version minor

# 3. Publish
npm publish

# 4. Announce the update
# - Twitter/X
# - GitHub release notes
# - npm package page
```

## Success Checklist

- [ ] npm account created and verified
- [ ] Logged in via `npm login`
- [ ] Package name is available
- [ ] Tests pass (`npm test`)
- [ ] Dry run successful (`npm pack --dry-run`)
- [ ] Published to npm (`npm publish`)
- [ ] Verified with `npx shai-hulud-inspector`
- [ ] Git tagged and pushed
- [ ] GitHub release created
- [ ] README updated with badges

## Resources

- [npm Documentation](https://docs.npmjs.com/)
- [Creating and Publishing Scoped Packages](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages)
- [Semantic Versioning](https://semver.org/)
- [npm CLI Documentation](https://docs.npmjs.com/cli/)

---

After publishing, users can simply run:

```bash
npx shai-hulud-inspector
```

And it will automatically download and execute your package! 🚀

