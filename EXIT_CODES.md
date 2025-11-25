# Exit Codes Reference

## Overview

Shai Hulud Inspector uses standard Unix exit codes to indicate scan results, making it perfect for CI/CD integration and automation scripts.

## Exit Codes

| Code | Status | Meaning | Action |
|------|--------|---------|--------|
| `0` | ✅ Success | No vulnerabilities found | Safe to proceed |
| `1` | ❌ Failure | Vulnerabilities detected OR error occurred | Block deployment/merge |

## Examples

### No Vulnerabilities (Exit Code 0)

```bash
$ npx shai-hulud-inspector@latest

🔎 Scanning project at: /path/to/project

╔═══════════════════════════════════════════════════════════════╗
║         SHAI HULUD VULNERABILITY SCANNER                      ║
║         🔒 100% Private - Zero Data Collection                ║
╚═══════════════════════════════════════════════════════════════╝

📦 Total packages scanned: 125
🔍 Known vulnerable packages in database: 689
⚠️  Vulnerable packages found: 0

✅ Great! No vulnerable packages detected in your dependencies.
   Exit code: 0 (Success)

$ echo $?
0
```

### Vulnerabilities Found (Exit Code 1)

```bash
$ npx shai-hulud-inspector@latest

🔎 Scanning project at: /path/to/project

╔═══════════════════════════════════════════════════════════════╗
║         SHAI HULUD VULNERABILITY SCANNER                      ║
║         🔒 100% Private - Zero Data Collection                ║
╚═══════════════════════════════════════════════════════════════╝

📦 Total packages scanned: 458
🔍 Known vulnerable packages in database: 689
⚠️  Vulnerable packages found: 2

⛔ VULNERABLE PACKAGES DETECTED:
...
❌ Exit code: 1 (Vulnerabilities found)

$ echo $?
1
```

### Error Occurred (Exit Code 1)

```bash
$ npx shai-hulud-inspector@latest /nonexistent/path

🔎 Scanning project at: /nonexistent/path

❌ Error: package-lock.json not found in /nonexistent/path

Usage: node index.js [project-path]

$ echo $?
1
```

## Usage in Scripts

### Bash Script

```bash
#!/bin/bash

echo "Running security scan..."

if npx shai-hulud-inspector@latest; then
    echo "✅ Security scan passed"
    exit 0
else
    echo "❌ Security scan failed - vulnerabilities detected!"
    exit 1
fi
```

### Makefile

```makefile
.PHONY: security-scan

security-scan:
	@echo "Running Shai Hulud security scan..."
	@npx shai-hulud-inspector@latest || (echo "❌ Vulnerabilities found!" && exit 1)
	@echo "✅ Security scan passed"
```

### Package.json Scripts

```json
{
  "scripts": {
    "presecurity": "echo 'Running security scan...'",
    "security": "npx shai-hulud-inspector@latest",
    "postsecurity": "echo 'Security scan completed'",
    "predeploy": "npm run security"
  }
}
```

## CI/CD Integration

### GitHub Actions

```yaml
- name: Security Scan
  run: npx shai-hulud-inspector@latest
  # Workflow fails if exit code is 1
```

### GitLab CI

```yaml
security_scan:
  script:
    - npx shai-hulud-inspector@latest
  # Pipeline fails if exit code is 1
```

### Jenkins

```groovy
stage('Security Scan') {
    steps {
        sh 'npx shai-hulud-inspector@latest'
        // Build fails if exit code is 1
    }
}
```

### CircleCI

```yaml
- run:
    name: Security Scan
    command: npx shai-hulud-inspector@latest
    # Job fails if exit code is 1
```

## Advanced Usage

### Conditional Actions

```bash
# Run scan and handle results
npx shai-hulud-inspector@latest
EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
    echo "✅ No vulnerabilities - deploying to production"
    npm run deploy:prod
elif [ $EXIT_CODE -eq 1 ]; then
    echo "❌ Vulnerabilities found - deploying to staging only"
    npm run deploy:staging
    exit 1
fi
```

### Warning Instead of Failure

```bash
# Allow build to continue but show warning
if ! npx shai-hulud-inspector@latest; then
    echo "⚠️  WARNING: Vulnerabilities detected but allowing build to continue"
    # Don't exit, continue with build
fi
```

### Multiple Scans

```bash
# Scan multiple projects
FAILED=0

for project in project1 project2 project3; do
    echo "Scanning $project..."
    if ! npx shai-hulud-inspector@latest "./$project"; then
        echo "❌ $project has vulnerabilities"
        FAILED=1
    fi
done

if [ $FAILED -eq 1 ]; then
    echo "❌ One or more projects failed security scan"
    exit 1
fi

echo "✅ All projects passed security scan"
```

### Pre-commit Hook

```bash
#!/bin/bash
# .git/hooks/pre-commit

echo "Running pre-commit security scan..."

if ! npx shai-hulud-inspector@latest; then
    echo ""
    echo "❌ COMMIT BLOCKED: Security vulnerabilities detected!"
    echo "Fix vulnerabilities before committing."
    exit 1
fi

echo "✅ Security scan passed"
exit 0
```

### Combined with Other Tools

```bash
#!/bin/bash

# Run multiple security checks
echo "Running comprehensive security checks..."

# 1. Shai Hulud scan
if ! npx shai-hulud-inspector@latest; then
    echo "❌ Shai Hulud scan failed"
    exit 1
fi

# 2. npm audit
if ! npm audit --audit-level=high; then
    echo "❌ npm audit failed"
    exit 1
fi

# 3. License check
if ! npx license-checker --summary; then
    echo "❌ License check failed"
    exit 1
fi

echo "✅ All security checks passed"
```

## Best Practices

### 1. Always Check Exit Codes in CI/CD
```yaml
# Good - Will fail on vulnerabilities
- run: npx shai-hulud-inspector@latest

# Bad - Will never fail
- run: npx shai-hulud-inspector@latest || true
```

### 2. Use in Pre-deployment Hooks
```json
{
  "scripts": {
    "predeploy": "npx shai-hulud-inspector@latest"
  }
}
```

### 3. Combine with Other Security Tools
```bash
npm audit && npx shai-hulud-inspector@latest && npm run test:security
```

### 4. Make It Required in Pull Requests
```yaml
# .github/workflows/pr-checks.yml
name: PR Checks
on: [pull_request]
jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm install
      - run: npx shai-hulud-inspector@latest
```

## Troubleshooting

### Exit Code Always 0

**Problem**: Scanner always returns 0 even with vulnerabilities

**Solution**: Check that you're not suppressing errors:
```bash
# Wrong
npx shai-hulud-inspector@latest || true

# Correct
npx shai-hulud-inspector@latest
```

### Exit Code Always 1

**Problem**: Scanner always fails

**Possible Causes**:
1. No `package-lock.json` in the scanned directory
2. Actual vulnerabilities present
3. Invalid project path

**Solution**: Check the error message in the output

## Summary

- Exit code `0` = ✅ Safe to proceed
- Exit code `1` = ❌ Block deployment
- Exit code is displayed in scan output
- Perfect for automated workflows
- Works with all CI/CD platforms
- Can be used in custom scripts

For more examples, see [USAGE_EXAMPLES.md](USAGE_EXAMPLES.md)

