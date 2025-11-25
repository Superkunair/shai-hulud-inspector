# Changelog

All notable changes to the Shai Hulud Inspector project will be documented in this file.

## [1.0.0] - 2025-11-25

### Added
- Initial release of Shai Hulud Inspector
- Core scanning functionality for npm dependencies
- Support for npm v6 and v7+ package-lock.json formats
- Database of 689 vulnerable packages from Shai Hulud attack
- CLI tool with beautiful formatted output
- `npm start` script to run the main scanner
- Comprehensive documentation (README, USAGE, PUBLISHING guides)
- Test suite for core functionality
- Exit codes for CI/CD integration (0 = safe, 1 = vulnerable)
- Programmatic API for Node.js integration
- Support for scanning transitive dependencies
- Semantic versioning comparison using semver library
- Examples and test project generator

### Features
- 🔍 Scans all dependencies and transitive dependencies
- 📊 Checks against 689+ known vulnerable packages
- 🎯 Exact version matching with semantic versioning
- 📝 Clear, actionable reporting
- ⚡ Fast and lightweight (< 1 second scan time)
- 🔒 Works offline (no external API calls)
- 🚀 Available via npx for instant use

### Documentation
- README.md - User-facing documentation
- USAGE.md - Comprehensive usage guide
- QUICK_PUBLISH.md - TL;DR publishing guide
- PUBLISHING.md - Detailed npm publishing guide
- HOW_IT_WORKS.md - Technical explanation of matching algorithm
- USAGE_EXAMPLES.md - All ways to run the scanner
- PROJECT_SUMMARY.md - Technical project overview

### Scripts
- `npm start` - Run the scanner on current directory
- `npm run scan` - Alias for starting the scanner
- `npm test` - Run test suite
- `npm run prepublishOnly` - Runs tests before publishing

### Repository
- GitHub: https://github.com/Superkunair/shai-hulud-inspector

### Author
- Jordan Axel Hernandez Mercado

---

## How to Use

### Recommended (npx with @latest):
```bash
npx shai-hulud-inspector@latest
```

### Install Globally:
```bash
npm install -g shai-hulud-inspector
shai-hulud-inspector
```

### Local Development:
```bash
git clone https://github.com/Superkunair/shai-hulud-inspector.git
cd shai-hulud-inspector
npm install
npm start
```

---

**Note**: Version numbers follow [Semantic Versioning](https://semver.org/).

