# Development Workflow Guide

## Overview
This guide provides step-by-step instructions for our development workflow, including JIRA ticket management, Git branching, merge requests, and testing procedures.

## Prerequisites
- Git installed and configured
- Access to the repository
- JIRA account with assigned tickets
- Node.js and npm installed

## 1. Setting Up Your Development Environment

### Initial Setup
```bash
# Clone the repository (if not already done)
git clone <repository-url>
cd WeGoApp

# Install dependencies
npm install

# Verify ESLint setup
npm run lint
```

## 2. Working with JIRA Tickets

### Branch Naming Convention
Use the following format for branch names:
```
feature/JIRA-123-short-description
bugfix/JIRA-456-short-description
hotfix/JIRA-789-short-description
```

**Examples:**
- `feature/WGA-101-user-authentication`
- `bugfix/WGA-202-login-validation-error`
- `hotfix/WGA-303-critical-security-patch`

## 3. Creating and Working on Feature Branches

### Step 1: Sync with Main Branch
```bash
# Switch to main branch
git checkout main

# Pull latest changes
git pull origin main
```

### Step 2: Create Feature Branch
```bash
# Create and switch to new branch
git checkout -b feature/JIRA-123-your-feature-name

# Verify you're on the correct branch
git branch
```

### Step 3: Make Your Changes
1. Implement your feature/fix
2. Test your changes locally
3. Run linting to ensure code quality

```bash
# Run ESLint to check for issues
npm run lint

# Start development server to test
npm run dev
# or
npx expo start --web
```

### Step 4: Commit Your Changes
```bash
# Stage your changes
git add .

# Commit with descriptive message
git commit -m "JIRA-123: Add user authentication feature

- Implement login form validation
- Add JWT token handling
- Update user state management
- Fix apostrophe rendering issues"
```

**Commit Message Format:**
```
JIRA-XXX: Brief description (50 chars max)

- Detailed bullet point 1
- Detailed bullet point 2
- Any breaking changes or important notes
```

## 4. Pre-Push Testing and Validation

### Step 1: Run Complete Test Suite
```bash
# Run ESLint (must pass with 0 errors)
npm run lint

# If you have tests, run them
npm test

# Build the project to check for build errors
npm run build
```

### Step 2: Test Cross-Platform Compatibility
```bash
# Test web version
npx expo start --web

# Test on different ports if needed
npx expo start --web --port 8085
```

### Step 3: Verify No Merge Conflicts
```bash
# Fetch latest changes from remote
git fetch origin

# Check if main has new commits
git log HEAD..origin/main --oneline

# If there are new commits, rebase your branch
git rebase origin/main
```

**If conflicts occur during rebase:**
```bash
# Resolve conflicts in your editor
# After resolving, stage the files
git add <resolved-files>

# Continue rebase
git rebase --continue

# If you need to abort
git rebase --abort
```

## 5. Pushing Your Branch

### Step 1: Push to Remote Repository
```bash
# Push your branch to remote
git push origin feature/JIRA-123-your-feature-name

# If it's your first push for this branch
git push -u origin feature/JIRA-123-your-feature-name
```

## 6. Creating a Merge Request (Pull Request)

### Step 1: Navigate to Repository
1. Go to your Git hosting platform (GitHub/GitLab/Bitbucket)
2. Navigate to the repository
3. You should see a prompt to create a merge request for your recently pushed branch

### Step 2: Fill Out Merge Request Details

**Title Format:**
```
JIRA-123: Brief description of changes
```

**Description Template:**
```markdown
## JIRA Ticket
[JIRA-123](link-to-jira-ticket)

## Description
Brief description of what this MR accomplishes.

## Changes Made
- [ ] Feature/fix 1
- [ ] Feature/fix 2
- [ ] Updated documentation
- [ ] Added/updated tests

## Testing
- [ ] ESLint passes (0 errors, 0 warnings)
- [ ] Manual testing completed
- [ ] Cross-browser testing (if applicable)
- [ ] Mobile responsiveness checked

## Screenshots/Videos
(If UI changes, include before/after screenshots)

## Breaking Changes
(List any breaking changes or migration steps needed)

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console errors in browser
```

### Step 3: Set Merge Request Options
- **Target Branch:** `main`
- **Assignee:** Yourself
- **Reviewers:** Add team members
- **Labels:** Add appropriate labels (feature, bugfix, etc.)
- **Milestone:** Link to sprint/release if applicable

## 7. Testing Before Merge (Reviewer Guidelines)

### Step 1: Checkout the Branch Locally
```bash
# Fetch the branch
git fetch origin

# Checkout the feature branch
git checkout feature/JIRA-123-your-feature-name

# Pull latest changes
git pull origin feature/JIRA-123-your-feature-name
```

### Step 2: Run Pre-Merge Tests
```bash
# Install any new dependencies
npm install

# Run ESLint
npm run lint

# Start development server
npm run dev

# Test the feature thoroughly
# Check for console errors
# Verify functionality works as expected
```

### Step 3: Test Merge Compatibility (Without Merging)
```bash
# Create a temporary branch to test merge
git checkout main
git pull origin main
git checkout -b temp-merge-test

# Attempt to merge the feature branch
git merge feature/JIRA-123-your-feature-name

# If successful, test the merged code
npm install
npm run lint
npm run dev

# Clean up test branch
git checkout main
git branch -D temp-merge-test
```

## 8. Merging Process

### Option A: Merge via Web Interface (Recommended)
1. Ensure all checks pass (CI/CD, reviews, etc.)
2. Click "Merge" button in the web interface
3. Choose merge strategy:
   - **Merge Commit:** Creates a merge commit (recommended for features)
   - **Squash and Merge:** Combines all commits into one (good for small fixes)
   - **Rebase and Merge:** Replays commits without merge commit

### Option B: Command Line Merge
```bash
# Switch to main branch
git checkout main

# Pull latest changes
git pull origin main

# Merge the feature branch
git merge feature/JIRA-123-your-feature-name

# Push the merged changes
git push origin main
```

## 9. Post-Merge Cleanup

### Step 1: Delete Feature Branch
```bash
# Delete local branch
git branch -d feature/JIRA-123-your-feature-name

# Delete remote branch (if not auto-deleted)
git push origin --delete feature/JIRA-123-your-feature-name
```

### Step 2: Update JIRA Ticket
1. Move JIRA ticket to "Done" or "Deployed" status
2. Add comment with merge request link
3. Update any relevant documentation

### Step 3: Sync Your Local Repository
```bash
# Switch to main and pull latest
git checkout main
git pull origin main

# Clean up any stale remote branches
git remote prune origin
```

## 10. Troubleshooting Common Issues

### ESLint Errors
```bash
# Fix auto-fixable issues
npm run lint -- --fix

# Check specific files
npx eslint app/your-file.jsx

# Ignore specific rules (use sparingly)
// eslint-disable-next-line rule-name
```

### Merge Conflicts
```bash
# View conflicted files
git status

# Open files and resolve conflicts manually
# Look for <<<<<<< HEAD, =======, >>>>>>> markers

# After resolving
git add <resolved-files>
git commit
```

### Build Errors
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Expo cache
npx expo start --clear
```

## 11. Best Practices

### Code Quality
- Always run `npm run lint` before committing
- Write descriptive commit messages
- Keep commits focused and atomic
- Test your changes thoroughly

### Branch Management
- Keep branches small and focused
- Regularly sync with main branch
- Delete merged branches promptly
- Use descriptive branch names

### Collaboration
- Review code thoroughly
- Provide constructive feedback
- Test others' changes locally
- Communicate about breaking changes

### JIRA Integration
- Always reference JIRA tickets in commits
- Update ticket status regularly
- Link merge requests to tickets
- Add time tracking if required

## 12. Emergency Procedures

### Hotfix Process
```bash
# Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/JIRA-999-critical-fix

# Make minimal changes
# Test thoroughly
# Follow normal merge process but prioritize review
```

### Rollback Process
```bash
# If you need to revert a merge
git revert -m 1 <merge-commit-hash>

# Push the revert
git push origin main
```

## Contact and Support
- For Git issues: Contact DevOps team
- For JIRA access: Contact Project Manager
- For code review questions: Contact Tech Lead
- For urgent issues: Use team Slack channel

---

**Remember:** When in doubt, ask for help! It's better to clarify the process than to make mistakes that affect the entire team.