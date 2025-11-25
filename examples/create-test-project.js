#!/usr/bin/env node

/**
 * Creates a test project with a vulnerable package for demonstration purposes
 * WARNING: This is for testing only! Do not use in production.
 */

const fs = require('fs');
const path = require('path');

const testProjectDir = path.join(__dirname, 'test-vulnerable-project');

// Create test project directory
if (!fs.existsSync(testProjectDir)) {
  fs.mkdirSync(testProjectDir, { recursive: true });
}

// Create a package.json with a known vulnerable package
const packageJson = {
  name: 'test-vulnerable-project',
  version: '1.0.0',
  description: 'Test project with Shai Hulud vulnerable packages (FOR TESTING ONLY)',
  dependencies: {
    '@posthog/icons': '0.36.1'
  }
};

// Create a mock package-lock.json
const packageLock = {
  name: 'test-vulnerable-project',
  version: '1.0.0',
  lockfileVersion: 3,
  requires: true,
  packages: {
    '': {
      name: 'test-vulnerable-project',
      version: '1.0.0',
      dependencies: {
        '@posthog/icons': '0.36.1'
      }
    },
    'node_modules/@posthog/icons': {
      version: '0.36.1',
      resolved: 'https://registry.npmjs.org/@posthog/icons/-/icons-0.36.1.tgz',
      integrity: 'sha512-example'
    }
  },
  dependencies: {
    '@posthog/icons': {
      version: '0.36.1',
      resolved: 'https://registry.npmjs.org/@posthog/icons/-/icons-0.36.1.tgz',
      integrity: 'sha512-example'
    }
  }
};

fs.writeFileSync(
  path.join(testProjectDir, 'package.json'),
  JSON.stringify(packageJson, null, 2)
);

fs.writeFileSync(
  path.join(testProjectDir, 'package-lock.json'),
  JSON.stringify(packageLock, null, 2)
);

console.log('✅ Test project created at:', testProjectDir);
console.log('\nTo test the scanner, run:');
console.log(`  node index.js ${testProjectDir}`);
console.log('\n⚠️  This project contains a MOCK vulnerable package for testing purposes.');

