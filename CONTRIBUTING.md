# Contributing to @mintlify/astro

Thank you for your interest in contributing to the Mintlify Astro integration! This document provides guidelines and information for contributors.

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Follow the setup instructions in [DEVELOPMENT.md](./DEVELOPMENT.md)

## Issue Labels

We use three labels to categorize issues:

- **bug** - Something isn't working as expected
- **improvement** - Enhancement to an existing feature
- **feature request** - Request for a new feature or capability

## How to Contribute

### Reporting Bugs

- Check the [existing issues](https://github.com/mintlify/astro/issues) to avoid duplicates
- Open a bug report with reproduction steps, expected behavior, and actual behavior
- Include relevant Astro and Node.js version information

### Requesting Features or Improvements

- Check existing issues first to avoid duplicates
- Describe the use case and why it would be valuable

### Submitting Changes

1. Create a new branch from `main`
2. Make your changes following our code style guidelines
3. Run `npm run build` to verify the build succeeds
4. Run `npm run type` to check for type errors
5. Run `npm run format` to auto-format code
6. Submit a pull request

### Pull Request Guidelines

- Keep PRs focused on a single change
- Write clear commit messages
- Update documentation if needed
- Ensure the build passes

## Code Style

- Use TypeScript for all code
- Follow existing patterns in the codebase
- Run `npm run format` to auto-format with Prettier

## Questions?

If you have questions, feel free to open a [GitHub Discussion](https://github.com/mintlify/astro/discussions) or an issue.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
