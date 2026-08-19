# Changesets

This directory is managed by [Changesets](https://github.com/changesets/changesets).

## Workflow

1. Make your changes
2. Run `bun changeset` to describe what changed
3. Commit the changeset file along with your code
4. When ready to release, run `bun changeset version` to bump versions and generate changelogs
5. Run `bun release` to publish to npm

## Commands

```bash
bun changeset          # Create a new changeset (interactive)
bun changeset version  # Apply changesets → bump versions + changelogs
bun release            # Build all packages and publish to npm
bun changeset status   # Check pending changesets
```
