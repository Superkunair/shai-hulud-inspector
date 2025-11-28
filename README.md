# Shai Hulud Inspector 🪱🔍

A security scanner that checks your npm dependencies against the Shai Hulud vulnerable packages database. This tool helps identify if your project contains any of the ~1000+ packages compromised in the Shai Hulud supply chain attack.

## Quick Start

```bash
npx shai-hulud-inspector@latest
```

That's it! No installation required. The scanner will check your project for vulnerabilities.

## What is Shai Hulud?

Shai Hulud is a sophisticated worm that spread through over 1,000 npm packages, named after the sandworms from the Dune universe. This attack represents one of the largest supply chain attacks targeting the npm ecosystem.

## Features

- 🔍 Scans all dependencies and transitive dependencies
- 📊 Checks against a database of 798+ known vulnerable packages
- 🎯 Identifies exact version matches
- 📋 **Smart Fallback** - Works with package-lock.json OR package.json
- 📝 Clear, actionable reporting
- ⚡ Fast and lightweight
- 🔒 Works offline (no external API calls)
- 🛡️ **100% Private - Zero data collection, zero telemetry, zero metrics**

## Installation

### Quick Start - No Installation Required! ⚡

Run instantly with npx (always uses latest version):

```bash
npx shai-hulud-inspector@latest
```

### Install Globally (Optional)

```bash
npm install -g shai-hulud-inspector
```

### Or clone and use locally

```bash
git clone https://github.com/Superkunair/shai-hulud-inspector.git
cd shai-hulud-inspector
npm install
npm start
```

## Usage

### Quick Start - Run with npx (Recommended) ⚡

**Scan your current project:**
```bash
npx shai-hulud-inspector@latest
```

**Scan a specific project:**
```bash
npx shai-hulud-inspector@latest /path/to/your/project
```

**Why use npx @latest?**
- ✅ No installation required
- ✅ Always uses the newest version
- ✅ Latest vulnerability database
- ✅ Perfect for CI/CD pipelines

### Alternative Methods

**If installed globally:**
```bash
shai-hulud-inspector
shai-hulud-inspector /path/to/your/project
```

**From cloned repository:**
```bash
npm start
npm start -- /path/to/your/project
```

### 📋 Dependency Scanning Modes

The scanner operates in two modes depending on what files it finds:

| Mode | File | Scans | Protection Level |
|------|------|-------|------------------|
| **Complete** ✅ | `package-lock.json` | Direct + Transitive dependencies | **Full Protection** |
| **Limited** ⚠️ | `package.json` only | Direct dependencies only | **Partial Protection** |

**⚠️ IMPORTANT:** Without `package-lock.json`, transitive dependencies (dependencies of your dependencies) are NOT scanned. This means hidden malicious packages could be missed!

**To generate package-lock.json:**
```bash
npm install
```

👉 **Learn more:** See [TRANSITIVE_DEPENDENCIES.md](TRANSITIVE_DEPENDENCIES.md) for why this matters

### Example Output

```
🔎 Scanning project at: /Users/username/my-project

╔═══════════════════════════════════════════════════════════════╗
║         SHAI HULUD VULNERABILITY SCANNER                      ║
╚═══════════════════════════════════════════════════════════════╝

📦 Total packages scanned: 458
🔍 Known vulnerable packages in database: 690
⚠️  Vulnerable packages found: 2

⛔ VULNERABLE PACKAGES DETECTED:

═══════════════════════════════════════════════════════════════

1. Package: @posthog/icons
   ├─ Installed version(s): 0.36.1
   ├─ Vulnerable version(s): 0.36.1
   └─ ⚠️  ACTION REQUIRED: Remove or update this package immediately!

2. Package: posthog-js
   ├─ Installed version(s): 1.297.3
   ├─ Vulnerable version(s): 1.297.3
   └─ ⚠️  ACTION REQUIRED: Remove or update this package immediately!

═══════════════════════════════════════════════════════════════

🔗 More info: https://www.bleepingcomputer.com/news/security/shai-hulud-worm-spreads-via-1000-npm-packages

⚡ Recommendation: Run "npm audit" and update/remove vulnerable packages.
```

## How It Works

1. **Dependency Extraction**: Reads your `package-lock.json` to extract all dependencies and transitive dependencies
2. **Version Matching**: Compares installed packages against the Shai Hulud vulnerable packages database
3. **Report Generation**: Displays a detailed report of any matches found

## Exit Codes

The scanner returns standard exit codes for easy CI/CD integration:

- **Exit Code 0**: ✅ No vulnerabilities found (Success)
- **Exit Code 1**: ❌ Vulnerabilities detected or error occurred (Failure)

The exit code is displayed at the end of each scan for transparency.

### CI/CD Integration

Use the exit code to fail builds when vulnerabilities are detected:

```bash
# In your CI pipeline (always use latest version)
npx shai-hulud-inspector@latest || exit 1

# Or if installed globally
shai-hulud-inspector || exit 1

# Check exit code explicitly
npx shai-hulud-inspector@latest
if [ $? -ne 0 ]; then
  echo "Build failed due to security vulnerabilities"
  exit 1
fi
```

**📁 Ready-to-use CI/CD Examples:**

We provide production-ready configuration files for:
- ✅ GitHub Actions
- ✅ AWS CodeBuild
- ✅ Azure Pipelines
- ✅ Google Cloud Build

**[📖 View CI/CD Examples →](examples/ci-cd/README.md)**

## Vulnerable Packages Database

The scanner checks against a curated list of 690+ packages identified in the Shai Hulud attack, stored in `artifacts/node/shai-hulud-2-packages.json`. This includes packages from various scopes including:

- @posthog/*
- @ensdomains/*
- @voiceflow/*
- @browserbasehq/*
- And many more...

## Requirements

- Node.js >= 14.0.0
- A project with `package-lock.json` file

## Testing

Run the included tests:

```bash
npm test
```

## Contributing

Found a vulnerable package not in the database? Please open an issue or submit a pull request with the package details.

## Limitations

- Requires `package-lock.json` (npm projects)
- Only checks exact version matches
- Does not scan `yarn.lock` or `pnpm-lock.yaml` (yet)

## Privacy & Security Notes

### 🔒 Privacy First

**This tool respects your privacy:**
- ✅ **No data collection** - We don't collect any information about your projects
- ✅ **No telemetry** - No usage statistics or analytics
- ✅ **No metrics** - No tracking of any kind
- ✅ **Completely offline** - All scanning happens locally on your machine
- ✅ **No external API calls** - Your code and dependencies stay private
- ✅ **Open source** - Audit the code yourself at [GitHub](https://github.com/Superkunair/shai-hulud-inspector)

### ⚠️ Security Scope

**Important**: This tool checks against a specific list of known vulnerable packages from the Shai Hulud attack. It does NOT:
- Replace comprehensive security tools like `npm audit`
- Check for other types of vulnerabilities
- Provide vulnerability fixes

Always use multiple security tools and keep your dependencies up to date.

## Resources

### Documentation
- [CI/CD Examples](examples/ci-cd/README.md) - Production-ready configs for GitHub Actions, AWS, Azure, GCP
- [Transitive Dependencies](TRANSITIVE_DEPENDENCIES.md) - **Why package-lock.json matters for security**
- [Exit Codes Reference](EXIT_CODES.md) - Complete guide to exit codes and CI/CD integration
- [Privacy Policy](PRIVACY.md) - Our zero data collection commitment
- [How It Works](HOW_IT_WORKS.md) - Technical explanation of the matching algorithm
- [Usage Examples](USAGE_EXAMPLES.md) - Comprehensive usage scenarios

### External Links
- [Bleeping Computer Article](https://www.bleepingcomputer.com/news/security/shai-hulud-worm-spreads-via-1000-npm-packages)
- [npm Security Best Practices](https://docs.npmjs.com/security-best-practices)


## License

ISC

## Author

Jordan Axel Hernandez Mercado

---

**Stay safe and keep your dependencies clean!** 

