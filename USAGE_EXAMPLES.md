# Usage Examples - All Ways to Run the Scanner

## 🚀 Recommended: npx with @latest

**Always gets the newest version, no installation needed:**

```bash
# Scan current directory
npx shai-hulud-inspector@latest

# Scan specific project
npx shai-hulud-inspector@latest /path/to/project

# Scan parent directory
npx shai-hulud-inspector@latest ..
```

**Why use @latest?**
- ✅ Always gets the most recent version with latest vulnerability database
- ✅ No need to manage global installations
- ✅ No stale cached versions
- ✅ Perfect for CI/CD pipelines

---

## 📦 Global Installation

**Install once, use anywhere:**

```bash
# Install
npm install -g shai-hulud-inspector

# Use
shai-hulud-inspector
shai-hulud-inspector /path/to/project

# Update when needed
npm update -g shai-hulud-inspector
```

---

## 💻 Local Development (Cloned Repository)

**For contributors or local development:**

```bash
# Clone
git clone https://github.com/Superkunair/shai-hulud-inspector.git
cd shai-hulud-inspector

# Install dependencies
npm install

# Run scanner on current directory
npm start

# Run scanner on specific project
npm start -- /path/to/project

# Alternative commands
npm run scan
npm run scan:example

# Run tests
npm test
```

---

## 🔧 As a Project Dependency

**Add to your project's package.json:**

```bash
# Install as dev dependency
npm install --save-dev shai-hulud-inspector

# Or with npx (no installation)
npx shai-hulud-inspector@latest
```

**In package.json:**

```json
{
  "scripts": {
    "security:scan": "shai-hulud-inspector",
    "presecurity:scan": "npm install"
  }
}
```

**Run:**

```bash
npm run security:scan
```

---

## 🤖 CI/CD Integration

### GitHub Actions

```yaml
name: Security Scan

on: [push, pull_request]

jobs:
  shai-hulud-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Scan for Shai Hulud vulnerabilities
        run: npx shai-hulud-inspector@latest
```

### GitLab CI

```yaml
shai-hulud-scan:
  stage: security
  image: node:18
  script:
    - npm install
    - npx shai-hulud-inspector@latest
  allow_failure: false
```

### CircleCI

```yaml
version: 2.1

jobs:
  security-scan:
    docker:
      - image: node:18
    steps:
      - checkout
      - run:
          name: Install dependencies
          command: npm install
      - run:
          name: Shai Hulud Scan
          command: npx shai-hulud-inspector@latest

workflows:
  version: 2
  build-and-test:
    jobs:
      - security-scan
```

### Jenkins Pipeline

```groovy
pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        
        stage('Shai Hulud Scan') {
            steps {
                sh 'npx shai-hulud-inspector@latest'
            }
        }
    }
}
```

### Azure Pipelines

```yaml
trigger:
  - main

pool:
  vmImage: 'ubuntu-latest'

steps:
  - task: NodeTool@0
    inputs:
      versionSpec: '18.x'
    displayName: 'Install Node.js'
  
  - script: npm install
    displayName: 'Install dependencies'
  
  - script: npx shai-hulud-inspector@latest
    displayName: 'Run Shai Hulud Scanner'
```

---

## 🐳 Docker

**Run in a container:**

```dockerfile
FROM node:18-alpine

WORKDIR /scan

# Copy project files
COPY package*.json ./
RUN npm install

# Run scanner
CMD ["npx", "shai-hulud-inspector@latest"]
```

**Use:**

```bash
# Build
docker build -t shai-hulud-scanner .

# Run on current directory
docker run -v $(pwd):/scan shai-hulud-scanner
```

---

## 🔍 Programmatic Usage

**Use in your Node.js scripts:**

```javascript
const { extractDependencies, scanForVulnerabilities } = require('shai-hulud-inspector');

async function scanProject(projectPath) {
  try {
    // Extract dependencies
    const dependencies = extractDependencies(projectPath);
    console.log(`Found ${dependencies.size} packages`);
    
    // Scan for vulnerabilities
    const results = scanForVulnerabilities(dependencies);
    
    // Process results
    if (results.matchesFound > 0) {
      console.error(`⚠️  Found ${results.matchesFound} vulnerable packages!`);
      
      results.matches.forEach(match => {
        console.error(`- ${match.package}@${match.installedVersions.join(', ')}`);
      });
      
      process.exit(1);
    } else {
      console.log('✅ No vulnerabilities found');
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Run scan
scanProject(process.cwd());
```

---

## 📊 Different Scenarios

### Scan Multiple Projects

```bash
#!/bin/bash

projects=(
  "/path/to/project1"
  "/path/to/project2"
  "/path/to/project3"
)

for project in "${projects[@]}"; do
  echo "Scanning $project..."
  npx shai-hulud-inspector@latest "$project"
done
```

### Scan with Error Handling

```bash
#!/bin/bash

if npx shai-hulud-inspector@latest; then
  echo "✅ No Shai Hulud vulnerabilities found"
  exit 0
else
  echo "⚠️  Vulnerabilities detected! Review output above."
  exit 1
fi
```

### Pre-commit Hook

**.git/hooks/pre-commit:**

```bash
#!/bin/bash

echo "Running Shai Hulud security scan..."

if ! npx shai-hulud-inspector@latest; then
  echo "❌ Shai Hulud vulnerabilities detected! Commit blocked."
  echo "Run 'npx shai-hulud-inspector@latest' to see details."
  exit 1
fi

echo "✅ No Shai Hulud vulnerabilities found"
exit 0
```

Make it executable:
```bash
chmod +x .git/hooks/pre-commit
```

---

## 🎯 Quick Reference

| Command | Description | Use Case |
|---------|-------------|----------|
| `npx shai-hulud-inspector@latest` | Run latest version | **Recommended** - Always up to date |
| `npx shai-hulud-inspector@latest .` | Scan current dir | Quick local scan |
| `npm start` | Run from cloned repo | Development |
| `shai-hulud-inspector` | Run global install | After `npm i -g` |
| `npm test` | Run tests | Verify functionality |

---

## 💡 Pro Tips

1. **Always use @latest in CI/CD** to ensure you have the newest vulnerability database
2. **Add to pre-commit hooks** to catch issues before they reach your repo
3. **Run regularly** as the vulnerability database may be updated
4. **Combine with npm audit** for comprehensive security coverage
5. **Use in staging/production deploys** as a safety check

---

**Need help?** Open an issue at: https://github.com/Superkunair/shai-hulud-inspector/issues

