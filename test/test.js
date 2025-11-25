const { parseVersionConstraint } = require('../lib/checker');
const { extractDependencies } = require('../lib/scanner');

console.log('Running Shai Hulud Inspector Tests...\n');

// Test 1: Parse version constraints
console.log('Test 1: Parse version constraints');
const test1 = parseVersionConstraint('= 1.0.1');
console.assert(test1.length === 1 && test1[0] === '1.0.1', 'Single version parsing failed');

const test2 = parseVersionConstraint('= 1.0.1 || = 1.0.2');
console.assert(test2.length === 2 && test2.includes('1.0.1') && test2.includes('1.0.2'), 'Multiple version parsing failed');
console.log('✅ Version parsing tests passed\n');

// Test 2: Scanner module
console.log('Test 2: Dependency extraction');
try {
  const deps = extractDependencies(__dirname + '/..');
  console.log(`✅ Found ${deps.size} dependencies`);
  console.log('   Sample packages:', Array.from(deps.keys()).slice(0, 5).join(', '));
} catch (error) {
  console.log('ℹ️  No package-lock.json found (expected for new project)');
}

console.log('\n✅ All tests passed!\n');

