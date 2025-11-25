# Shai Hulud Inspector 🪱🔍

A security scanner that checks your npm dependencies against the Shai Hulud vulnerable packages database. This tool helps identify if your project contains any of the ~1000+ packages compromised in the Shai Hulud supply chain attack.

## What is Shai Hulud?

Shai Hulud is a sophisticated worm that spread through over 1,000 npm packages, named after the sandworms from the Dune universe. This attack represents one of the largest supply chain attacks targeting the npm ecosystem.

## Features

- 🔍 Scans all dependencies and transitive dependencies
- 📊 Checks against a database of 690+ known vulnerable packages
- 🎯 Identifies exact version matches
- 📝 Clear, actionable reporting
- ⚡ Fast and lightweight
- 🔒 Works offline (no external API calls)

## Installation

### Install globally (recommended)

```bash
npm install -g shai-hulud-inspector
```

### Or clone and use locally

```bash
git clone <repository-url>
cd shai-hulud-inspector
npm install
```

## Usage

### Scan your current project

```bash
# If installed globally
shai-hulud-inspector

# Or from the project directory
npm run scan
```

### Scan a specific project

```bash
shai-hulud-inspector /path/to/your/project

# Or
node index.js /path/to/your/project
```

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

- `0`: No vulnerabilities found
- `1`: Vulnerabilities detected or error occurred

This makes it easy to integrate into CI/CD pipelines:

```bash
# In your CI pipeline
shai-hulud-inspector || exit 1
```

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

## Security Notes

⚠️ **Important**: This tool checks against a specific list of known vulnerable packages from the Shai Hulud attack. It does NOT:
- Replace comprehensive security tools like `npm audit`
- Check for other types of vulnerabilities
- Provide vulnerability fixes

Always use multiple security tools and keep your dependencies up to date.

## Resources

- [Bleeping Computer Article](https://www.bleepingcomputer.com/news/security/shai-hulud-worm-spreads-via-1000-npm-packages)
- [npm Security Best Practices](https://docs.npmjs.com/security-best-practices)

## License

ISC

## Author

Jordan Axel Hernandez Mercado

---

**Stay safe and keep your dependencies clean!** 

