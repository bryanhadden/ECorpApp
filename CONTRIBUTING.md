# Contributing to E Corp

Thank you for your interest in contributing to the E Corp mobile application! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing Requirements](#testing-requirements)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors.

### Expected Behavior

- Be respectful and professional
- Welcome newcomers and help them get started
- Accept constructive criticism gracefully
- Focus on what is best for the project
- Show empathy towards other contributors

### Unacceptable Behavior

- Harassment, trolling, or insulting comments
- Public or private harassment
- Publishing others' private information
- Other unprofessional conduct

---

## Getting Started

### Prerequisites

1. **Read the Documentation**:

   - [README.md](README.md) - Project overview
   - [LOCAL_DEVELOPMENT.md](docs/LOCAL_DEVELOPMENT.md) - Setup guide
   - [CODE_QUALITY.md](docs/CODE_QUALITY.md) - Code standards

2. **Set Up Your Environment**:

   ```bash
   # Clone the repository
   git clone https://github.com/yourusername/ecorp-app.git
   cd ecorp-app

   # Install dependencies
   npm install

   # Install iOS dependencies (macOS only)
   cd ios && pod install && cd ..

   # Install git hooks
   npm run prepare
   ```

3. **Verify Setup**:

   ```bash
   # Run tests
   npm test

   # Run linter
   npm run lint

   # Run type checker
   npm run type-check

   # Start app
   npm run ios  # or npm run android
   ```

---

## Development Workflow

### 1. Find or Create an Issue

- Check [existing issues](https://github.com/yourusername/ecorp-app/issues)
- If no issue exists, create one describing the bug or feature
- Wait for approval before starting work (for features)

### 2. Create a Branch

```bash
# Update your local main branch
git checkout main
git pull origin main

# Create a feature branch
git checkout -b feature/your-feature-name

# Branch naming conventions:
# feature/  - New features
# fix/      - Bug fixes
# docs/     - Documentation changes
# refactor/ - Code refactoring
# test/     - Adding tests
```

### 3. Make Your Changes

```bash
# Make changes to the code
# Follow code standards (see below)

# Test your changes
npm run ios  # or android

# Run validation
npm run lint:fix
npm run type-check
npm test
```

### 4. Commit Your Changes

```bash
# Stage your changes
git add .

# Commit with conventional commit message
git commit -m "feat(warehouse): add barcode scanner integration"

# Pre-commit hooks will automatically:
# - Lint and format your code
# - Run type checking
```

### 5. Push and Create Pull Request

```bash
# Push your branch
git push origin feature/your-feature-name

# Create a Pull Request on GitHub
# Fill in the PR template
# Link related issues
```

---

## Code Standards

### TypeScript

✅ **DO**:

```typescript
// Use explicit types
interface User {
  id: string;
  name: string;
  role: UserRole;
}

const fetchUser = async (id: string): Promise<User> => {
  // ...
};

// Use const for immutable values
const MAX_ATTEMPTS = 3;

// Use arrow functions
const calculateTotal = (items: Item[]): number => {
  return items.reduce((sum, item) => sum + item.price, 0);
};
```

❌ **DON'T**:

```typescript
// Don't use any
const data: any = ...

// Don't use var
var count = 0;

// Don't omit types
const fetchUser = (id) => { ... }

// Don't use function keyword for new functions
function calculateTotal(items) { ... }
```

### React/React Native

✅ **DO**:

```typescript
// Use functional components
const Button: React.FC<ButtonProps> = ({title, onPress}) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

// Extract styles to StyleSheet
const styles = StyleSheet.create({
  button: {
    padding: spacing.md,
    backgroundColor: colors.primary,
  },
  text: {
    color: colors.white,
  },
});

// Extract event handlers
const handlePress = () => {
  console.log('Button pressed');
};

<Button onPress={handlePress} />;
```

❌ **DON'T**:

```typescript
// Don't use inline styles
<View style={{padding: 10}} />

// Don't use inline functions
<Button onPress={() => console.log('pressed')} />

// Don't use class components (unless necessary)
class Button extends React.Component { ... }
```

### File Organization

```
src/
├── components/       # Reusable components
│   ├── Button.tsx
│   └── Card.tsx
├── screens/          # Screen components
│   ├── auth/
│   ├── warehouse/
│   └── dealership/
├── navigation/       # Navigation setup
├── context/          # React Context providers
├── styles/           # Theme and shared styles
├── types/            # TypeScript definitions
└── utils/            # Helper functions
```

### Naming Conventions

| Type       | Convention                          | Example                         |
| ---------- | ----------------------------------- | ------------------------------- |
| Components | PascalCase                          | `Button.tsx`, `LoginScreen.tsx` |
| Utilities  | camelCase                           | `formatDate.ts`, `apiClient.ts` |
| Constants  | UPPER_SNAKE_CASE                    | `API_URL`, `MAX_RETRIES`        |
| Interfaces | PascalCase with 'I' prefix optional | `User`, `IAuthContext`          |
| Types      | PascalCase                          | `UserRole`, `ApiResponse`       |

---

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/).

### Format

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `test`: Adding or updating tests
- `build`: Build system changes
- `ci`: CI/CD changes
- `chore`: Other changes

### Examples

```bash
# Good commits
git commit -m "feat(auth): add password reset flow"
git commit -m "fix(warehouse): resolve crash on scan button tap"
git commit -m "docs(readme): update installation steps"
git commit -m "refactor(theme): extract color constants"
git commit -m "test(button): add snapshot tests"

# With body
git commit -m "feat(sales): add vehicle selection

Implemented a vehicle selector component that shows
all available models with pricing. Integrated with
the new sale form.

Closes #123"
```

### What Makes a Good Commit

✅ **Good Commits**:

- Atomic (one logical change)
- Well-described subject
- Explains the "why" in the body if needed
- References related issues

❌ **Bad Commits**:

- Multiple unrelated changes
- Vague messages ("fix bug", "update code")
- No context or explanation

---

## Pull Request Process

### Before Creating a PR

```bash
# 1. Update from main
git checkout main
git pull origin main
git checkout your-branch
git rebase main

# 2. Run full validation
npm run validate

# 3. Test manually
npm run ios
npm run android
```

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] All tests pass (`npm test`)
- [ ] No linting errors (`npm run lint`)
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] Added/updated tests for changes
- [ ] Updated documentation if needed
- [ ] Self-reviewed the code
- [ ] PR description explains what and why
- [ ] Linked related issues
- [ ] Screenshots/videos for UI changes

### PR Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues

Closes #123

## Testing

- [ ] Tested on iOS
- [ ] Tested on Android
- [ ] All unit tests pass
- [ ] Manual testing completed

## Screenshots/Videos

[If applicable]

## Checklist

- [ ] Code follows style guidelines
- [ ] Performed self-review
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] No new warnings
- [ ] Added tests
```

### Review Process

1. **Automated Checks**: CI/CD runs tests, linting, type checking
2. **Code Review**: Reviewers check code quality, logic, tests
3. **Approval**: At least 1 approval required
4. **Merge**: Squash and merge into main

### Addressing Feedback

```bash
# Make requested changes
# Commit with descriptive message
git commit -m "refactor: address PR feedback

- Extracted helper function
- Added error handling
- Updated tests"

# Push to same branch
git push origin feature/your-feature-name

# PR automatically updates
```

---

## Testing Requirements

### Unit Tests

Required for:

- Utility functions
- Complex logic
- Components with logic

```typescript
// Example: src/utils/__tests__/formatDate.test.ts
import {formatDate} from '../formatDate';

describe('formatDate', () => {
  it('formats date correctly', () => {
    const date = new Date('2025-01-15');
    expect(formatDate(date)).toBe('01/15/2025');
  });
});
```

### Component Tests

```typescript
// Example: src/components/__tests__/Button.test.tsx
import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import Button from '../Button';

describe('Button', () => {
  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const {getByText} = render(<Button title="Test" onPress={onPress} />);

    fireEvent.press(getByText('Test'));
    expect(onPress).toHaveBeenCalled();
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# Specific test file
npm test Button.test.tsx
```

---

## Getting Help

- **Questions**: Open a [Discussion](https://github.com/yourusername/ecorp-app/discussions)
- **Bugs**: Open an [Issue](https://github.com/yourusername/ecorp-app/issues)
- **Security**: Email security@ecorp.com

---

## Recognition

Contributors are recognized in:

- [Contributors](https://github.com/yourusername/ecorp-app/graphs/contributors) page
- Release notes for significant contributions
- Special mentions for first-time contributors

---

## Additional Resources

- [React Native Documentation](https://reactnative.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Testing Library](https://testing-library.com/docs/react-native-testing-library/intro/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

**Thank you for contributing to E Corp!** 🎉
