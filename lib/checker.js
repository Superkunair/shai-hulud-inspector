const fs = require('fs');
const path = require('path');
const semver = require('semver');

/**
 * Loads the Shai Hulud vulnerable packages list
 * @returns {Array<{Package: string, Version: string}>}
 */
function loadVulnerablePackages() {
  const vulnerablePackagesPath = path.join(__dirname, '../artifacts/node/shai-hulud-2-packages.json');
  
  if (!fs.existsSync(vulnerablePackagesPath)) {
    throw new Error('Shai Hulud packages list not found');
  }

  return JSON.parse(fs.readFileSync(vulnerablePackagesPath, 'utf8'));
}

/**
 * Parses version constraint from Shai Hulud format
 * Handles formats like "= 1.0.1", "= 1.0.1 || = 1.0.2"
 * @param {string} versionString - Version constraint string
 * @returns {Array<string>} Array of exact versions
 */
function parseVersionConstraint(versionString) {
  // Split by || for multiple versions
  const parts = versionString.split('||').map(v => v.trim());
  
  // Extract version numbers (remove "=" prefix)
  return parts.map(part => {
    const match = part.match(/=\s*(.+)/);
    return match ? match[1].trim() : part.trim();
  });
}

/**
 * Checks if installed dependencies match vulnerable packages
 * @param {Map<string, Set<string>>} installedDeps - Map of installed dependencies
 * @param {Array<{Package: string, Version: string}>} vulnerablePackages - List of vulnerable packages
 * @returns {Array<{package: string, installedVersions: string[], vulnerableVersions: string[]}>}
 */
function checkForVulnerablePackages(installedDeps, vulnerablePackages) {
  const matches = [];

  for (const vuln of vulnerablePackages) {
    const packageName = vuln.Package;
    const vulnerableVersions = parseVersionConstraint(vuln.Version);

    if (installedDeps.has(packageName)) {
      const installedVersions = Array.from(installedDeps.get(packageName));
      
      // Check if any installed version matches vulnerable versions
      const matchingVersions = installedVersions.filter(installed =>
        vulnerableVersions.some(vulnerable => {
          try {
            // Try semver comparison first
            return semver.satisfies(installed, `=${vulnerable}`);
          } catch {
            // Fallback to exact string match
            return installed === vulnerable;
          }
        })
      );

      if (matchingVersions.length > 0) {
        matches.push({
          package: packageName,
          installedVersions: matchingVersions,
          vulnerableVersions: vulnerableVersions,
          allInstalledVersions: installedVersions
        });
      }
    }
  }

  return matches;
}

/**
 * Main function to scan and check for vulnerabilities
 * @param {Map<string, Set<string>>} installedDeps - Map of installed dependencies
 * @returns {Object} Scan results
 */
function scanForVulnerabilities(installedDeps) {
  const vulnerablePackages = loadVulnerablePackages();
  const matches = checkForVulnerablePackages(installedDeps, vulnerablePackages);

  return {
    totalPackagesScanned: installedDeps.size,
    totalVulnerablePackages: vulnerablePackages.length,
    matchesFound: matches.length,
    matches: matches
  };
}

module.exports = {
  loadVulnerablePackages,
  parseVersionConstraint,
  checkForVulnerablePackages,
  scanForVulnerabilities
};

