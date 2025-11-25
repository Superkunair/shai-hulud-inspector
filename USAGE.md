# Usage Guide

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run the Scanner

Scan your current project:

```bash
npm run scan
```

Or scan any other project:

```bash
node index.js /path/to/project
```

## Examples

### Example 1: Scanning a Project with No Vulnerabilities

```bash
$ node index.js .

🔎 Scanning project at: /Users/username/my-safe-project

╔═══════════════════════════════════════════════════════════════╗
║         SHAI HULUD VULNERABILITY SCANNER                      ║
╚═══════════════════════════════════════════════════════════════╝

📦 Total packages scanned: 125
🔍 Known vulnerable packages in database: 689
⚠️  Vulnerable packages found: 0

✅ Great! No vulnerable packages detected in your dependencies.
```

### Example 2: Scanning a Project with Vulnerabilities

If vulnerabilities are found, you'll see:

```bash
$ node index.js /path/to/vulnerable-project

🔎 Scanning project at: /path/to/vulnerable-project

╔═══════════════════════════════════════════════════════════════╗
║         SHAI HULUD VULNERABILITY SCANNER                      ║
╚═══════════════════════════════════════════════════════════════╝

📦 Total packages scanned: 458
🔍 Known vulnerable packages in database: 689
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

## Using in CI/CD

Add to your CI pipeline to automatically fail builds with vulnerable dependencies:

### GitHub Actions

```yaml
name: Security Scan

on: [push, pull_request]

jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install scanner
        run: npm install -g shai-hulud-inspector
      - name: Run scan
        run: shai-hulud-inspector
```

### GitLab CI

```yaml
security_scan:
  stage: test
  script:
    - npm install -g shai-hulud-inspector
    - shai-hulud-inspector
  allow_failure: false
```

### Jenkins

```groovy
stage('Security Scan') {
    steps {
        sh 'npm install -g shai-hulud-inspector'
        sh 'shai-hulud-inspector'
    }
}
```

## Programmatic Usage

You can also use the scanner programmatically in your Node.js scripts:

```javascript
const { extractDependencies, scanForVulnerabilities } = require('shai-hulud-inspector');

// Extract dependencies from a project
const dependencies = extractDependencies('/path/to/project');

// Scan for vulnerabilities
const results = scanForVulnerabilities(dependencies);

console.log(`Found ${results.matchesFound} vulnerable packages`);

// Process results
if (results.matchesFound > 0) {
  results.matches.forEach(match => {
    console.log(`⚠️  ${match.package} v${match.installedVersions.join(', ')}`);
  });
  process.exit(1);
}
```

## Updating the Vulnerable Packages Database

The database is stored in `artifacts/node/shai-hulud-2-packages.json`. To update it:

1. Obtain the latest list of vulnerable packages
2. Format as JSON array with `Package` and `Version` fields
3. Replace the file content

Example format:

```json
[
  {
    "Package": "package-name",
    "Version": "= 1.0.1"
  },
  {
    "Package": "another-package",
    "Version": "= 2.0.1 || = 2.0.2"
  }
]
```

## Troubleshooting

### "package-lock.json not found"

Make sure you're in a directory with a Node.js project that has a `package-lock.json` file. If you're using Yarn or pnpm, those lock files are not currently supported.

### Scanner reports no packages

If the scanner reports 0 packages, check that:
- You have a valid `package-lock.json` file
- The file is not corrupted
- You have dependencies installed in your project

### False negatives

The scanner only checks against known vulnerable packages in the database. Always use additional security tools like:
- `npm audit`
- Snyk
- Dependabot

## FAQ

**Q: Does this replace npm audit?**
A: No, this is a specialized tool for detecting Shai Hulud packages. Always use multiple security tools.

**Q: Will this slow down my builds?**
A: No, the scanner is very fast and runs offline. Typical scan time is under 1 second.

**Q: Can I scan Yarn or pnpm projects?**
A: Not yet, but support is planned for future versions.

**Q: What if I have a vulnerable package as a transitive dependency?**
A: The scanner checks ALL dependencies including transitive ones. You'll need to either update the parent package or use npm overrides.

