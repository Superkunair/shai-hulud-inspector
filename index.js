#!/usr/bin/env node

const { extractDependencies, getAllDependencies } = require('./lib/scanner');
const { scanForVulnerabilities } = require('./lib/checker');
const path = require('path');

/**
 * Formats the scan results for console output
 */
function formatResults(results) {
  console.log('\n╔═══════════════════════════════════════════════════════════════╗');
  console.log('║         SHAI HULUD VULNERABILITY SCANNER                      ║');
  console.log('║         🔒 100% Private - Zero Data Collection                ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');

  const scanTypeLabel = results.isLockFile ? '(including transitive)' : '(direct only)';
  console.log(`📦 Total packages scanned: ${results.totalPackagesScanned} ${scanTypeLabel}`);
  console.log(`🔍 Known vulnerable packages in database: ${results.totalVulnerablePackages}`);
  console.log(`⚠️  Vulnerable packages found: ${results.matchesFound}\n`);

  if (results.matchesFound === 0) {
    console.log('✅ Great! No vulnerable packages detected in your dependencies.');
    
    if (!results.isLockFile) {
      console.log('\n⚠️  NOTE: Only DIRECT dependencies were scanned');
      console.log('   For complete protection, generate package-lock.json:');
      console.log('   $ npm install\n');
    }
    
    console.log('   Exit code: 0 (Success)\n');
    return;
  }

  console.log('⛔ VULNERABLE PACKAGES DETECTED:\n');
  console.log('═'.repeat(70) + '\n');

  results.matches.forEach((match, index) => {
    console.log(`${index + 1}. Package: ${match.package}`);
    console.log(`   ├─ Installed version(s): ${match.installedVersions.join(', ')}`);
    console.log(`   ├─ Vulnerable version(s): ${match.vulnerableVersions.join(', ')}`);
    if (match.allInstalledVersions.length > match.installedVersions.length) {
      const safeVersions = match.allInstalledVersions.filter(
        v => !match.installedVersions.includes(v)
      );
      console.log(`   ├─ Other installed versions: ${safeVersions.join(', ')}`);
    }
    console.log(`   └─ ⚠️  ACTION REQUIRED: Remove or update this package immediately!\n`);
  });

  console.log('═'.repeat(70));
  console.log('\n🔗 More info: https://www.bleepingcomputer.com/news/security/shai-hulud-worm-spreads-via-1000-npm-packages');
  console.log('\n⚡ Recommendation: Run "npm audit" and update/remove vulnerable packages.');
  console.log('\n❌ Exit code: 1 (Vulnerabilities found)\n');
}

/**
 * Main CLI function
 */
function main() {
  const args = process.argv.slice(2);
  const projectPath = args[0] || process.cwd();

  console.log(`\n🔎 Scanning project at: ${path.resolve(projectPath)}\n`);

  try {
    // Extract all dependencies
    const scanResult = extractDependencies(projectPath);
    
    // Display warnings if any (e.g., no package-lock.json)
    if (scanResult.warnings && scanResult.warnings.length > 0) {
      console.log('⚠️  WARNINGS:\n');
      scanResult.warnings.forEach(warning => console.log(warning));
      console.log('');
    }
    
    // Scan for vulnerabilities
    const results = scanForVulnerabilities(scanResult.dependencies);
    
    // Add scan metadata to results
    results.isLockFile = scanResult.isLockFile;
    results.hasWarnings = scanResult.warnings && scanResult.warnings.length > 0;
    
    // Format and display results
    formatResults(results);

    // Exit with error code if vulnerabilities found
    process.exit(results.matchesFound > 0 ? 1 : 0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nUsage: node index.js [project-path]\n');
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = {
  extractDependencies,
  getAllDependencies,
  scanForVulnerabilities,
  formatResults
};
