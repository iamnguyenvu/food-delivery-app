# Contributing to DearU Food

Thank you for your interest in contributing! This guide will help you get started.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards others

## Getting Started

### 1. Fork and Clone

```bash
# Fork the repo on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/food-delivery-app.git
cd food-delivery-app

# Add upstream remote
git remote add upstream https://github.com/iamnguyenvu/food-delivery-app.git
```

### 2. Create a Branch

```bash
# Update main branch
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name
```

### 3. Make Changes

- Write clean, readable code
- Follow the existing code style
- Add comments for complex logic
- Update documentation if needed

### 4. Test Your Changes

```bash
# Type check
npm run type-check

# Lint
npm run lint

# Test on device
npm start
```

**Note:** CI/CD workflows sẽ tự động chạy các test này khi bạn push code.

### 5. CI/CD Workflows

Khi bạn push code hoặc tạo PR, các workflows sau sẽ tự động chạy:

✅ **CI Workflow** (`.github/workflows/ci.yml`)
- ESLint check
- TypeScript type check  
- Unit tests (nếu có)
- Build preview

✅ **Code Quality** (`.github/workflows/code-quality.yml`)
- Code quality analysis
- Security audit
- Package outdated check

**Xem kết quả:**
- Tab **Actions** trên GitHub
- Status check trên PR
- Badge trong PR description

**Nếu workflow fail:**
1. Xem logs chi tiết trong tab Actions
2. Fix lỗi locally: `npm run type-check && npm run lint`
3. Push lại code

### 6. Commit Your Changes

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Format: <type>(<scope>): <description>

git commit -m "feat: add restaurant search feature"
git commit -m "fix: resolve location permission bug"
git commit -m "docs: update API documentation"
git commit -m "chore: upgrade dependencies"
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (formatting)
- `refactor`: Code refactoring
- `test`: Tests
- `chore`: Maintenance

### 6. Push and Create PR

```bash
# Push to your fork
git push origin feature/your-feature-name

# Create Pull Request on GitHub
```

## Pull Request Guidelines

### PR Title
Use conventional commit format:
```
feat: add restaurant search feature
```

### PR Description
Include:
- **What**: What does this PR do?
- **Why**: Why is this change needed?
- **How**: How does it work?
- **Testing**: How was it tested?
- **Screenshots**: If UI changes

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested on iOS
- [ ] Tested on Android
- [ ] Tested on Web

## Screenshots
(if applicable)

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed code
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] No new warnings
- [ ] Added tests (if applicable)
```

## Code Style

### TypeScript
- Use strict mode
- Define types for all props
- Avoid `any` type
- Use interfaces for objects

```tsx
// Good
interface UserProps {
  name: string;
  age: number;
}

// Bad
type UserProps = {
  name: any;
  age: any;
}
```

### React Components
- Use functional components
- Use hooks instead of class components
- Extract custom hooks for reusable logic
- Keep components small and focused

```tsx
// Good
export default function UserCard({ user }: { user: User }) {
  const { formatDate } = useDate();
  
  return (
    <View>
      <Text>{user.name}</Text>
      <Text>{formatDate(user.createdAt)}</Text>
    </View>
  );
}
```

### Naming Conventions
- **Components**: PascalCase (`UserCard.tsx`)
- **Hooks**: camelCase with `use` prefix (`useAuth.ts`)
- **Utils**: camelCase (`formatDate.ts`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Types**: PascalCase (`User`, `Order`)

### File Structure
```
ComponentName/
├── ComponentName.tsx       # Main component
├── ComponentName.styles.ts # Styles (if needed)
├── ComponentName.test.tsx  # Tests
└── index.ts               # Exports
```

### Imports Order
1. React imports
2. Third-party imports
3. Local imports (components, hooks, utils)
4. Types
5. Styles

```tsx
import { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { useQuery } from '@tanstack/react-query';

import { Button } from '@/components/common';
import { useAuth } from '@/src/hooks';
import type { User } from '@/src/types';
```

## Common Tasks

### Adding a New Screen

1. Create file in `app/(tabs)/` or `app/(screens)/`
2. Add screen component
3. Update navigation if needed
4. Add types in `src/types/`
5. Update documentation

### Adding a New Component

1. Create component file
2. Define props interface
3. Add component logic
4. Export in `index.ts`
5. Add to Storybook (if applicable)

### Adding a New Hook

1. Create hook file in `src/hooks/`
2. Define hook logic
3. Add TypeScript types
4. Export in `src/hooks/index.ts`
5. Add JSDoc comments

### Updating Database Schema

1. Update `docs/database-schema.sql`
2. Create migration file
3. Test migration locally
4. Update TypeScript types
5. Update documentation

## Reporting Issues

### Bug Reports
Include:
- Clear title
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots/videos
- Device/OS version
- App version

### Feature Requests
Include:
- Clear description
- Use case
- Expected behavior
- Alternatives considered
- Additional context

## Questions?

- 📖 Check [Documentation](../docs/)
- 💬 Open a [Discussion](https://github.com/iamnguyenvu/food-delivery-app/discussions)
- 🐛 Report [Issues](https://github.com/iamnguyenvu/food-delivery-app/issues)

## Recognition

Contributors will be added to:
- README.md contributors section
- GitHub contributors page
- Release notes

Thank you for contributing! 🎉
