# Git

**Git** is a distributed version control system created by Linus Torvalds in 2005 to manage the Linux kernel development. It has since become the industry standard for source code management.

## Core Concepts

### Repository
A Git repository (repo) is a directory containing your project files and the entire history of changes.

### Commit
A snapshot of your project at a specific point in time:

```bash
git add .
git commit -m "Add new feature"
```

### Branch
An independent line of development, allowing multiple features to be worked on simultaneously:

```bash
git branch feature-login
git checkout feature-login
```

## Common Commands

| Command | Purpose |
|---------|---------|
| `git init` | Create a new repository |
| `git clone` | Copy an existing repository |
| `git status` | Check the state of your working directory |
| `git log` | View commit history |
| `git push` | Upload commits to a remote |
| `git pull` | Download changes from a remote |

## GitHub

[GitHub](/wiki/HTML) is an online platform for hosting Git repositories, adding features like:

- Pull requests for code review
- Actions for CI/CD automation
- Issues and project management
- Pages for hosting static sites

## Branching Strategy

A common workflow for teams:

```
main ──────●──────────●──────────
            \        /
feature-x    ●──●──●
```

See also: [Django](/wiki/Django), [Python](/wiki/Python), [HTML](/wiki/HTML)
