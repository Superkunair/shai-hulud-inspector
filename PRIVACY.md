# Privacy Policy

## TL;DR

**Shai Hulud Inspector collects ZERO data. Period.**

---

## Our Commitment to Privacy

Shai Hulud Inspector is a security tool, and we understand that privacy is paramount. This document explains our approach to data collection and privacy.

## What We Don't Collect

### ❌ No Usage Data
- We don't track when you run the scanner
- We don't log how many times you use it
- We don't record which projects you scan
- We don't collect command-line arguments
- We don't track your scanning patterns

### ❌ No Project Information
- We don't collect your package names
- We don't collect your dependency versions
- We don't collect your project structure
- We don't collect file paths
- We don't collect any code or configuration files

### ❌ No User Information
- We don't collect your IP address
- We don't collect your machine information
- We don't collect your username or email
- We don't collect your operating system details
- We don't collect your Node.js version

### ❌ No Telemetry or Analytics
- We don't use Google Analytics
- We don't use any third-party analytics services
- We don't send any data to our servers (we don't even have servers!)
- We don't use cookies or tracking pixels
- We don't use error reporting services that collect data

### ❌ No Network Calls
- The tool runs **100% offline**
- No outbound HTTP/HTTPS requests
- No DNS lookups for tracking
- No "phone home" functionality
- No version checks that leak data

## How It Works

### Everything Happens Locally

1. **You run the command**: `npx shai-hulud-inspector@latest`
2. **npm downloads the package** (one-time, from npmjs.com)
3. **Scanner reads your local `package-lock.json`**
4. **Comparison happens on your machine** against the included vulnerability database
5. **Results display in your terminal**
6. **End** - No data leaves your computer

### What We Bundle

The package includes:
- Scanner code (open source, auditable)
- Vulnerability database (static JSON file)
- Documentation

That's it. No tracking code, no analytics libraries, no telemetry SDKs.

## Verify Our Claims

### 1. Audit the Source Code

The entire codebase is open source:
- **GitHub**: https://github.com/Superkunair/shai-hulud-inspector
- Review every line of code
- Check for any network calls
- Look for any data collection

### 2. Monitor Network Activity

Run the scanner while monitoring your network:

```bash
# macOS/Linux - Monitor network with tcpdump
sudo tcpdump -i any host not localhost &
npx shai-hulud-inspector@latest
```

You'll see:
- ✅ npm downloads the package (expected, one-time)
- ✅ **Zero other network activity from the scanner**

### 3. Check the Code for Network Calls

Search the codebase:

```bash
git clone https://github.com/Superkunair/shai-hulud-inspector.git
cd shai-hulud-inspector

# Search for any HTTP/HTTPS libraries
grep -r "axios\|fetch\|http\|https\|request" lib/ index.js

# You'll find: NONE (except in comments/documentation)
```

### 4. Review Dependencies

We only use one dependency:

```json
{
  "dependencies": {
    "semver": "^7.6.0"  // For version comparison only
  }
}
```

The `semver` package is:
- ✅ Widely trusted (used by npm itself)
- ✅ Pure computational library
- ✅ No network functionality
- ✅ No telemetry

## Why This Matters

### Security Tools Must Be Trustworthy

When you run a security scanner, you're giving it access to:
- Your project structure
- Your dependencies
- Your environment
- Potentially sensitive information

**We take this responsibility seriously.**

You shouldn't have to trust us blindly. That's why:
- ✅ Our code is open source
- ✅ Our promises are verifiable
- ✅ Our architecture makes data collection impossible

### Other Tools May Collect Data

Many security tools collect:
- Usage analytics ("for improving the product")
- Vulnerability findings ("for aggregated statistics")
- Error reports ("for debugging")

**We don't do any of this.**

## Technical Architecture

### Why We Can't Collect Data (Even If We Wanted To)

1. **No Backend**: We don't have any servers or databases
2. **No API Endpoints**: There's nowhere to send data
3. **Offline-First Design**: The tool is architecturally designed to work offline
4. **Static Database**: Vulnerabilities are bundled in the package, not fetched online

### How Updates Work

When you run `npx shai-hulud-inspector@latest`:
- npm checks npmjs.com for the latest version
- npm downloads the package if needed
- The scanner runs entirely locally

**We never see any of this**. It's all between you and npm.

## Comparisons

| Feature | Shai Hulud Inspector | Typical SaaS Security Tools |
|---------|---------------------|----------------------------|
| Data Collection | ❌ Zero | ✅ Yes |
| Telemetry | ❌ None | ✅ Yes |
| Network Calls | ❌ None (after download) | ✅ Required |
| Usage Tracking | ❌ No | ✅ Yes |
| Error Reporting | ❌ No | ✅ Yes |
| Anonymous Analytics | ❌ No | ✅ Yes |
| User Accounts | ❌ No | Often Required |
| Privacy Policy Changes | ❌ N/A | Can Change |

## Our Promise

**We commit to:**

1. ✅ Never adding analytics or telemetry
2. ✅ Never collecting any user data
3. ✅ Never making network calls (except npm package download)
4. ✅ Remaining open source for auditing
5. ✅ Keeping the tool 100% offline-capable

**If we ever break this promise**, it would be:
- A complete rewrite of the architecture
- Obvious in the code (please audit!)
- Against the entire philosophy of the project

## For Enterprise Users

### Compliance Friendly

This tool is safe for use in:
- ✅ Air-gapped environments
- ✅ GDPR-compliant workflows
- ✅ HIPAA-compliant environments
- ✅ Highly regulated industries
- ✅ Sensitive government projects

### No Data Processing Agreement Needed

Since we don't process any data, you don't need:
- Data Processing Agreements (DPA)
- Business Associate Agreements (BAA)
- Standard Contractual Clauses (SCC)
- Privacy impact assessments (for this tool)

## Questions?

### "How do you improve the product without usage data?"

We improve through:
- GitHub issues and feature requests
- Pull requests from the community
- Security research about new vulnerable packages
- User feedback (voluntarily shared)

### "How do you know the tool is working?"

We provide:
- Open source code you can test
- Example projects for validation
- Test suite you can run
- CI/CD integration for automated testing

### "What about crash reports?"

We don't collect them. If the tool crashes:
- Error stays in your terminal
- No data sent anywhere
- You can report it on GitHub (at your discretion)

### "Is this legally binding?"

This document describes our current practices and technical architecture. Since we have no infrastructure to collect data, changing this would require a fundamental rewrite that would be visible in the code.

## Contact

Found a privacy concern or have questions?
- Open an issue: https://github.com/Superkunair/shai-hulud-inspector/issues
- Review the code: https://github.com/Superkunair/shai-hulud-inspector

---

## Summary

🔒 **Shai Hulud Inspector is designed from the ground up to respect your privacy.**

- ✅ Zero data collection
- ✅ Zero telemetry  
- ✅ Zero tracking
- ✅ 100% offline operation
- ✅ Open source & auditable
- ✅ No servers, no databases, no analytics

**Your projects and dependencies stay private. Always.**

---

*Last Updated: November 25, 2025*  
*Version: 1.0.0*

