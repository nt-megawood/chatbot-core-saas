# Security and repository policy

## Artifact-only publishing

This repository is restricted to:

- README
- docs
- obfuscated dist JavaScript artifacts

Excluded:

- source files
- tests
- source maps
- build config internals

## Obfuscation

Distribution artifacts are obfuscated before publish.

## Git history hardening

The repository was reinitialized to a clean single-commit baseline to remove normal branch access to historical source commits.

Important:

- Already-cloned copies outside this repository cannot be revoked.
- Git object caches on remote providers can persist temporarily.
- For strict legal purging, open a provider support request for sensitive-data GC.

## Operational safeguards

- Keep branch protections enabled
- Restrict who can force-push
- Use repository rulesets to block forbidden file patterns