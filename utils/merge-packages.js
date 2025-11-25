#!/usr/bin/env node

/**
 * Merge Shai Hulud Package Lists
 * 
 * This utility merges multiple Shai Hulud vulnerable package JSON files,
 * removes duplicates, and normalizes version formats.
 */

const fs = require('fs');
const path = require('path');

const ARTIFACTS_DIR = path.join(__dirname, '../artifacts/node');
const FILE1 = path.join(ARTIFACTS_DIR, 'shai-hulud-2-packages.json');
const FILE2 = path.join(ARTIFACTS_DIR, 'shai-hulud-2-more-packages.json');
const OUTPUT_FILE = path.join(ARTIFACTS_DIR, 'shai-hulud-merged-packages.json');

/**
 * Normalize version format to use "= version" format
 */
function normalizeVersion(version) {
  // If already starts with "=", return as is
  if (version.trim().startsWith('=')) {
    return version.trim();
  }
  // Otherwise, add "= " prefix
  return `= ${version.trim()}`;
}

/**
 * Create a unique key for deduplication
 */
function createKey(packageName, version) {
  // Normalize version to ensure consistent comparison
  const normalizedVersion = normalizeVersion(version);
  return `${packageName}||${normalizedVersion}`;
}

/**
 * Parse version constraints into individual versions
 * Example: "= 1.0.1 || = 1.0.2" becomes ["= 1.0.1", "= 1.0.2"]
 */
function parseVersions(versionString) {
  return versionString
    .split('||')
    .map(v => v.trim())
    .filter(v => v.length > 0);
}

/**
 * Merge packages from multiple files
 */
function mergePackages() {
  console.log('🔄 Starting package merge process...\n');

  // Read both files
  console.log('📖 Reading input files...');
  const packages1 = JSON.parse(fs.readFileSync(FILE1, 'utf8'));
  const packages2 = JSON.parse(fs.readFileSync(FILE2, 'utf8'));
  
  console.log(`   - ${path.basename(FILE1)}: ${packages1.length} entries`);
  console.log(`   - ${path.basename(FILE2)}: ${packages2.length} entries`);

  // Use a Map to store unique package-version combinations
  const uniquePackages = new Map();
  
  // Process first file
  console.log('\n🔍 Processing first file...');
  packages1.forEach(pkg => {
    const versions = parseVersions(pkg.Version);
    versions.forEach(version => {
      const key = createKey(pkg.Package, version);
      if (!uniquePackages.has(key)) {
        uniquePackages.set(key, {
          Package: pkg.Package,
          Version: normalizeVersion(version)
        });
      }
    });
  });

  // Process second file
  console.log('🔍 Processing second file...');
  let newPackagesCount = 0;
  packages2.forEach(pkg => {
    const versions = parseVersions(pkg.Version);
    versions.forEach(version => {
      const key = createKey(pkg.Package, version);
      if (!uniquePackages.has(key)) {
        uniquePackages.set(key, {
          Package: pkg.Package,
          Version: normalizeVersion(version)
        });
        newPackagesCount++;
      }
    });
  });

  // Convert Map to array and group by package name
  console.log('\n🔄 Grouping versions by package...');
  const packageMap = new Map();
  
  for (const pkg of uniquePackages.values()) {
    if (!packageMap.has(pkg.Package)) {
      packageMap.set(pkg.Package, []);
    }
    packageMap.get(pkg.Package).push(pkg.Version);
  }

  // Create final array with combined versions
  const mergedPackages = [];
  for (const [packageName, versions] of packageMap.entries()) {
    // Sort versions for consistency
    versions.sort();
    
    // Combine multiple versions with " || " separator
    const versionString = versions.join(' || ');
    
    mergedPackages.push({
      Package: packageName,
      Version: versionString
    });
  }

  // Sort by package name
  mergedPackages.sort((a, b) => a.Package.localeCompare(b.Package));

  // Write output file
  console.log('\n💾 Writing merged output...');
  fs.writeFileSync(
    OUTPUT_FILE,
    JSON.stringify(mergedPackages, null, 2),
    'utf8'
  );

  // Print statistics
  console.log('\n✅ Merge complete!\n');
  console.log('📊 Statistics:');
  console.log(`   - Total unique package-version combinations: ${uniquePackages.size}`);
  console.log(`   - Total unique packages: ${packageMap.size}`);
  console.log(`   - New entries from second file: ${newPackagesCount}`);
  console.log(`   - Duplicates removed: ${(packages1.length + packages2.length) - uniquePackages.size}`);
  console.log(`\n📄 Output file: ${path.relative(process.cwd(), OUTPUT_FILE)}`);
}

// Run the merge
try {
  mergePackages();
} catch (error) {
  console.error('\n❌ Error:', error.message);
  process.exit(1);
}

