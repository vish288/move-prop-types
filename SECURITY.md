# Security Policy

## 🔒 Supported Versions

We actively support the following versions of move-prop-types:

| Version | Supported          |
| ------- | ------------------ |
| 0.8.x   | ✅ Yes             |
| 0.7.x   | ❌ No              |
| < 0.7   | ❌ No              |

## 🚨 Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability, please report it responsibly:

### How to Report

1. **Email**: Send details to security@visurya.dev (if available) or create a private security advisory on GitHub
2. **GitHub Security Advisory**: Use the "Report a vulnerability" button in the Security tab
3. **Do NOT**: Open a public issue for security vulnerabilities

### What to Include

Please provide:

- **Description** of the vulnerability
- **Steps to reproduce** the issue
- **Potential impact** assessment
- **Suggested fix** if you have one
- **Your contact information** for follow-up

### Response Timeline

- **24 hours**: Initial acknowledgment
- **72 hours**: Preliminary assessment
- **7 days**: Detailed response with fix timeline
- **30 days**: Target resolution (critical issues prioritized)

## 🛡️ Security Considerations

### File System Operations
- move-prop-types modifies source code files
- Always backup your code before running transformations
- Review changes before committing to version control
- Use in trusted environments only

### Regular Expression Security
- Our regex patterns are designed to prevent ReDoS attacks
- We validate input patterns to avoid catastrophic backtracking
- Report any patterns that cause excessive processing time

### Dependency Security
- We regularly audit dependencies for vulnerabilities
- Dependencies are automatically updated for security patches
- We use `pnpm audit` in our CI pipeline

### Input Validation
- File paths are validated to prevent directory traversal
- File content is sanitized to prevent code injection
- Command-line arguments are properly escaped

## 🔧 Security Best Practices

When using move-prop-types:

### For Users
1. **Backup First**: Always backup your codebase before transformation
2. **Review Changes**: Inspect all modifications before committing
3. **Test Thoroughly**: Run your test suite after transformation
4. **Trusted Sources**: Only run on code you trust

### For Contributors
1. **Input Validation**: Validate all user inputs
2. **Safe Defaults**: Use secure defaults for all operations
3. **Error Handling**: Don't expose sensitive information in errors
4. **Dependencies**: Keep dependencies updated and audited

## 📋 Security Checklist

Before each release, we verify:

- [ ] All dependencies are up to date
- [ ] No known vulnerabilities in dependencies
- [ ] Input validation is comprehensive
- [ ] File operations are safe and contained
- [ ] Error messages don't leak sensitive information
- [ ] Regular expressions are tested for ReDoS
- [ ] Code has been reviewed for security issues

## 🔍 Vulnerability Disclosure

When we receive security reports:

1. **Assessment**: We evaluate the severity and impact
2. **Fix Development**: We develop and test a fix
3. **Coordinated Disclosure**: We work with reporters on timing
4. **Release**: We release patches and security advisories
5. **Communication**: We notify users through appropriate channels

## 📞 Contact

For security-related questions or concerns:

- **Security Issues**: Use GitHub Security Advisory
- **General Security Questions**: Open a regular GitHub issue
- **Urgent Matters**: Contact repository maintainers directly

## 🙏 Recognition

We appreciate responsible disclosure and will:

- Credit security researchers (with permission)
- Provide details in our security advisories
- Consider security contributions for special recognition

---

Thank you for helping keep move-prop-types secure! 🔒