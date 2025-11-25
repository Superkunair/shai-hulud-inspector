# Utilities

This folder contains utility scripts for maintaining the Shai Hulud Inspector project.

## merge-packages.js

Merges multiple Shai Hulud vulnerable package JSON files into a single consolidated list.

### Features

- ✅ Merges multiple JSON package lists
- ✅ Removes duplicate package-version combinations
- ✅ Normalizes version formats (adds `= ` prefix)
- ✅ Groups multiple versions of the same package with `||` separator
- ✅ Sorts packages alphabetically
- ✅ Provides detailed statistics

### Usage

```bash
# Using npm script (recommended)
npm run merge-packages

# Or directly
node utils/merge-packages.js
```

### Input Files

The script merges these files from `artifacts/node/`:
- `shai-hulud-2-packages.json` (original list)
- `shai-hulud-2-more-packages.json` (additional list)

### Output

Creates a merged file at:
- `artifacts/node/shai-hulud-merged-packages.json`

### Example Output

```json
[
  {
    "Package": "@asyncapi/diff",
    "Version": "= 0.5.2"
  },
  {
    "Package": "posthog-node",
    "Version": "= 4.18.1 || = 5.11.3 || = 5.13.3"
  }
]
```

### Statistics

After running, the script displays:
- Total unique package-version combinations
- Total unique packages
- New entries from additional files
- Number of duplicates removed

### Example Output

```
🔄 Starting package merge process...

📖 Reading input files...
   - shai-hulud-2-packages.json: 689 entries
   - shai-hulud-2-more-packages.json: 1000 entries

📊 Statistics:
   - Total unique package-version combinations: 1074
   - Total unique packages: 798
   - New entries from second file: 169
   - Duplicates removed: 615

📄 Output file: artifacts/node/shai-hulud-merged-packages.json
```

## Adding New Package Lists

To add support for additional package lists:

1. Place the new JSON file in `artifacts/node/`
2. Edit `merge-packages.js` and add the new file to the merge process:

```javascript
const FILE3 = path.join(ARTIFACTS_DIR, 'shai-hulud-3-packages.json');

// In mergePackages function, add:
const packages3 = JSON.parse(fs.readFileSync(FILE3, 'utf8'));
// ... process packages3
```

## Version Format

The merger normalizes all versions to use the `= version` format:

- Input: `"1.0.1"` → Output: `"= 1.0.1"`
- Input: `"= 1.0.1"` → Output: `"= 1.0.1"` (unchanged)

Multiple versions are combined with ` || `:
- `"= 1.0.1 || = 1.0.2"`

