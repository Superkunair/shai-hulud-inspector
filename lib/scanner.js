const fs = require('fs');
const path = require('path');

/**
 * Extracts all dependencies and transitive dependencies from package-lock.json
 * @param {string} projectPath - Path to the project directory
 * @returns {Map<string, Set<string>>} Map of package names to their versions
 */
function extractDependencies(projectPath) {
  const packageLockPath = path.join(projectPath, 'package-lock.json');
  
  if (!fs.existsSync(packageLockPath)) {
    throw new Error(`package-lock.json not found in ${projectPath}`);
  }

  const packageLock = JSON.parse(fs.readFileSync(packageLockPath, 'utf8'));
  const dependencies = new Map();

  // Handle both npm v1/v2 (flat) and npm v3+ (nested) package-lock formats
  if (packageLock.packages) {
    // npm v7+ format
    extractFromPackagesV7(packageLock.packages, dependencies);
  } else if (packageLock.dependencies) {
    // npm v6 and earlier format
    extractFromDependenciesV6(packageLock.dependencies, dependencies);
  }

  return dependencies;
}

/**
 * Extract dependencies from npm v7+ format (packages field)
 */
function extractFromPackagesV7(packages, dependencies) {
  for (const [pkgPath, pkgInfo] of Object.entries(packages)) {
    // Skip the root package (empty string or "")
    if (!pkgPath || pkgPath === '') continue;
    
    // Extract package name from path (remove node_modules/ prefix)
    const pkgName = pkgPath.replace(/^node_modules\//, '');
    
    if (pkgInfo.version) {
      if (!dependencies.has(pkgName)) {
        dependencies.set(pkgName, new Set());
      }
      dependencies.get(pkgName).add(pkgInfo.version);
    }
  }
}

/**
 * Extract dependencies from npm v6 format (dependencies field)
 */
function extractFromDependenciesV6(deps, dependencies) {
  for (const [pkgName, pkgInfo] of Object.entries(deps)) {
    if (pkgInfo.version) {
      if (!dependencies.has(pkgName)) {
        dependencies.set(pkgName, new Set());
      }
      dependencies.get(pkgName).add(pkgInfo.version);
    }

    // Recursively process nested dependencies
    if (pkgInfo.dependencies) {
      extractFromDependenciesV6(pkgInfo.dependencies, dependencies);
    }
  }
}

/**
 * Gets all dependencies from the current project
 * @param {string} [projectPath=process.cwd()] - Path to scan
 * @returns {Array<{name: string, versions: string[]}>} Array of dependencies
 */
function getAllDependencies(projectPath = process.cwd()) {
  const dependenciesMap = extractDependencies(projectPath);
  
  return Array.from(dependenciesMap.entries()).map(([name, versions]) => ({
    name,
    versions: Array.from(versions).sort()
  }));
}

module.exports = {
  extractDependencies,
  getAllDependencies
};

