# CI/CD Integration Examples

This directory contains production-ready configuration files for integrating Shai Hulud Inspector into various CI/CD platforms.

## 🚀 Quick Start

1. Choose your CI/CD platform
2. Copy the appropriate configuration file to your repository
3. Follow the setup instructions below
4. Commit and push - the scanner will run automatically!

## 📁 Available Examples

| Platform | File | Status |
|----------|------|--------|
| **GitHub Actions** | `github-actions.yml` | ✅ Ready to use |
| **AWS CodeBuild** | `aws-codebuild.yml` | ✅ Ready to use |
| **Azure Pipelines** | `azure-pipelines.yml` | ✅ Ready to use |
| **Google Cloud Build** | `gcp-cloudbuild.yaml` | ✅ Ready to use |

## Platform-Specific Setup

### GitHub Actions

**File Location**: `.github/workflows/security-scan.yml`

1. Create the directory structure:
   ```bash
   mkdir -p .github/workflows
   ```

2. Copy the configuration:
   ```bash
   cp examples/ci-cd/github-actions.yml .github/workflows/security-scan.yml
   ```

3. Commit and push:
   ```bash
   git add .github/workflows/security-scan.yml
   git commit -m "Add Shai Hulud security scan"
   git push
   ```

4. The workflow will run on:
   - Push to `main` or `develop` branches
   - Pull requests to `main` or `develop` branches
   - Manual trigger via GitHub UI

**View Results**: Go to your repository → Actions tab

---

### AWS CodeBuild

**File Location**: `buildspec.yml` (repository root)

1. Copy the configuration:
   ```bash
   cp examples/ci-cd/aws-codebuild.yml buildspec.yml
   ```

2. Create a CodeBuild project:
   - Go to AWS CodeBuild console
   - Create build project
   - Connect your repository
   - Use `buildspec.yml` as the build specification

3. Configure triggers:
   - Push to main branch
   - Pull requests
   - Scheduled builds (optional)

4. Set environment variables (if needed):
   - `SCAN_PATH`: Path to scan (default: ".")
   - `SLACK_WEBHOOK`: Slack webhook for notifications

**View Results**: AWS CodeBuild console → Build history

---

### Azure Pipelines

**File Location**: `azure-pipelines.yml` (repository root)

1. Copy the configuration:
   ```bash
   cp examples/ci-cd/azure-pipelines.yml azure-pipelines.yml
   ```

2. Set up Azure Pipeline:
   - Go to Azure DevOps
   - Create new pipeline
   - Select your repository
   - Choose "Existing Azure Pipelines YAML file"
   - Select `azure-pipelines.yml`

3. Configure triggers (in the YAML file):
   - Branch triggers
   - Path triggers
   - Scheduled triggers

4. Add variable group for notifications (optional):
   - Library → Variable groups
   - Name: `security-notifications`
   - Add: `TEAMS_WEBHOOK`

**View Results**: Azure DevOps → Pipelines → Your pipeline

---

### Google Cloud Build

**File Location**: `cloudbuild.yaml` (repository root)

1. Copy the configuration:
   ```bash
   cp examples/ci-cd/gcp-cloudbuild.yaml cloudbuild.yaml
   ```

2. Enable Cloud Build API:
   ```bash
   gcloud services enable cloudbuild.googleapis.com
   ```

3. Create a trigger:
   ```bash
   gcloud builds triggers create github \
     --repo-name=YOUR_REPO \
     --repo-owner=YOUR_USERNAME \
     --branch-pattern="^main$" \
     --build-config=cloudbuild.yaml
   ```

4. Or via Console:
   - Go to Cloud Build → Triggers
   - Connect repository
   - Create trigger
   - Select `cloudbuild.yaml`

**View Results**: Cloud Build → History

---

## 🎯 How It Works

### Exit Codes

All examples use the scanner's exit codes for build control:

- **Exit 0**: ✅ No vulnerabilities → Build continues
- **Exit 1**: ❌ Vulnerabilities found → Build FAILS

### Build Flow

```
┌─────────────────────────┐
│ 1. Checkout Code        │
└────────┬────────────────┘
         │
┌────────▼────────────────┐
│ 2. Install Dependencies │
└────────┬────────────────┘
         │
┌────────▼────────────────┐
│ 3. Run Security Scan    │ ← Shai Hulud Inspector
└────────┬────────────────┘
         │
    ✅ Pass? ❌ Fail?
         │         │
         │         └─→ BUILD FAILS
         │              (Exit 1)
         │
┌────────▼────────────────┐
│ 4. Build Application    │
└────────┬────────────────┘
         │
┌────────▼────────────────┐
│ 5. Deploy (if configured)│
└─────────────────────────┘
```

## 📊 Example Outputs

### Success (Exit 0)
```
Running Shai Hulud security scan...

╔═══════════════════════════════════════════════════════════════╗
║         SHAI HULUD VULNERABILITY SCANNER                      ║
║         🔒 100% Private - Zero Data Collection                ║
╚═══════════════════════════════════════════════════════════════╝

📦 Total packages scanned: 125
🔍 Known vulnerable packages in database: 689
⚠️  Vulnerable packages found: 0

✅ Great! No vulnerable packages detected in your dependencies.
   Exit code: 0 (Success)

✅ Security scan passed - continuing build...
```

### Failure (Exit 1)
```
Running Shai Hulud security scan...

╔═══════════════════════════════════════════════════════════════╗
║         SHAI HULUD VULNERABILITY SCANNER                      ║
║         🔒 100% Private - Zero Data Collection                ║
╚═══════════════════════════════════════════════════════════════╝

📦 Total packages scanned: 458
🔍 Known vulnerable packages in database: 689
⚠️  Vulnerable packages found: 2

⛔ VULNERABLE PACKAGES DETECTED:

1. Package: @posthog/icons
   ├─ Installed version(s): 0.36.1
   └─ ⚠️  ACTION REQUIRED: Remove or update this package immediately!

❌ Exit code: 1 (Vulnerabilities found)

❌ BUILD FAILED - Security vulnerabilities detected!
```

## 🔧 Customization Options

### Scan Specific Path

```yaml
# GitHub Actions
- run: npx shai-hulud-inspector@latest ./my-app

# AWS CodeBuild
- npx shai-hulud-inspector@latest ./my-app

# Azure Pipelines
- script: npx shai-hulud-inspector@latest ./my-app

# GCP Cloud Build
args: ['shai-hulud-inspector@latest', './my-app']
```

### Multiple Projects

See the "Advanced examples" sections in each configuration file.

### Scheduled Scans

Each platform includes examples for scheduled/cron-based scans:
- Daily security audits
- Weekly dependency checks
- Monthly compliance scans

### Notifications

Examples include optional notifications for:
- Slack
- Microsoft Teams
- Email
- Custom webhooks

### Conditional Deployment

All examples show how to:
- Block deployments on vulnerabilities
- Deploy to staging vs production based on branch
- Conditional actions based on scan results

## 🎓 Best Practices

### 1. Run Early in Pipeline
Place the security scan **before** building to fail fast:
```yaml
steps:
  - checkout
  - install dependencies
  - security scan  ← HERE (early)
  - build
  - test
  - deploy
```

### 2. Use @latest Version
Always use `@latest` to get the newest vulnerability database:
```bash
npx shai-hulud-inspector@latest
```

### 3. Fail Fast
Don't suppress errors - let builds fail on vulnerabilities:
```bash
# Good ✅
npx shai-hulud-inspector@latest

# Bad ❌
npx shai-hulud-inspector@latest || true
```

### 4. Cache Dependencies
Use platform-specific caching to speed up builds:
- GitHub Actions: `cache: 'npm'`
- AWS CodeBuild: `cache: paths`
- Azure Pipelines: Automatic
- GCP Cloud Build: Cloud Storage

### 5. Add to Required Checks
Make the security scan a required status check for merging PRs.

## 🔍 Debugging

### Check Exit Code

```bash
# Bash/Zsh
npx shai-hulud-inspector@latest
echo "Exit code: $?"

# PowerShell
npx shai-hulud-inspector@latest
echo "Exit code: $LASTEXITCODE"
```

### Verbose Logging

Most CI platforms show full output by default. Look for:
- Security scan results
- Exit code messages
- Error details

### Common Issues

**Issue**: Build doesn't fail on vulnerabilities
- **Fix**: Remove `|| true` or `continueOnError: true`

**Issue**: Scanner not found
- **Fix**: Ensure Node.js 14+ is installed

**Issue**: No package-lock.json
- **Fix**: Run `npm install` to generate it

## 📚 Additional Resources

- [Exit Codes Reference](../../EXIT_CODES.md)
- [Complete Usage Guide](../../USAGE.md)
- [Privacy Policy](../../PRIVACY.md)
- [Main Documentation](../../README.md)

## 🤝 Contributing

Have an example for another CI/CD platform? Please contribute!

- CircleCI
- Travis CI
- GitLab CI (self-hosted)
- Bitbucket Pipelines
- Jenkins

## 📞 Support

Issues or questions?
- Open an issue: https://github.com/Superkunair/shai-hulud-inspector/issues
- Check the docs: [README.md](../../README.md)

---

**Last Updated**: November 25, 2025  
**Examples Status**: ✅ All tested and working

