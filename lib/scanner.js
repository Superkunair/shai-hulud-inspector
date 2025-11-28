const fs = require('fs');
const path = require('path');

/**
 * Extracts all dependencies and transitive dependencies from package-lock.json
 * Falls back to package.json if lock file is not available (DIRECT DEPENDENCIES ONLY)
 * @param {string} projectPath - Path to the project directory
 * @returns {{dependencies: Map<string, Set<string>>, isLockFile: boolean, warnings: string[]}} 
 */
function extractDependencies(projectPath) {
  const packageLockPath = path.join(projectPath, 'package-lock.json');
  const packageJsonPath = path.join(projectPath, 'package.json');
  const warnings = [];
  
  // Try package-lock.json first (includes transitive dependencies)
  if (fs.existsSync(packageLockPath)) {
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

    return { dependencies, isLockFile: true, warnings };
  }
  
  // Fallback to package.json (DIRECT DEPENDENCIES ONLY)
  if (fs.existsSync(packageJsonPath)) {
    warnings.push('⚠️  No package-lock.json found - scanning DIRECT dependencies only');
    warnings.push('⚠️  Transitive dependencies (nested dependencies) are NOT scanned');
    warnings.push('💡 Run "npm install" to generate package-lock.json for complete scan');
    
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const dependencies = new Map();
    
    // Extract direct dependencies (no version resolution, just ranges)
    extractFromPackageJson(packageJson, dependencies);
    
    return { dependencies, isLockFile: false, warnings };
  }
  
  // Neither file found
  throw new Error(`Neither package-lock.json nor package.json found in ${projectPath}`);
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
 * Extract DIRECT dependencies from package.json
 * Note: This does NOT include transitive dependencies
 * @param {object} packageJson - Parsed package.json content
 * @param {Map} dependencies - Map to populate with dependencies
 */
function extractFromPackageJson(packageJson, dependencies) {
  const depTypes = ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies'];
  
  for (const depType of depTypes) {
    const deps = packageJson[depType];
    if (!deps) continue;
    
    for (const [pkgName, versionRange] of Object.entries(deps)) {
      if (!dependencies.has(pkgName)) {
        dependencies.set(pkgName, new Set());
      }
      // Store the version range as-is (e.g., "^1.0.0", "~2.1.0", ">=3.0.0")
      // The checker will need to handle range matching
      dependencies.get(pkgName).add(versionRange);
    }
  }
}

/**
 * Gets all dependencies from the current project
 * @param {string} [projectPath=process.cwd()] - Path to scan
 * @returns {{dependencies: Array<{name: string, versions: string[]}>, isLockFile: boolean, warnings: string[]}}
 */
function getAllDependencies(projectPath = process.cwd()) {
  const result = extractDependencies(projectPath);
  
  return {
    dependencies: Array.from(result.dependencies.entries()).map(([name, versions]) => ({
      name,
      versions: Array.from(versions).sort()
    })),
    isLockFile: result.isLockFile,
    warnings: result.warnings
  };
}

module.exports = {
  extractDependencies,
  getAllDependencies
};

