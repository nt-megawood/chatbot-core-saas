# Session restore and migration

Session restore uses versioned snapshots.

Key fields:

- storage.version
- storage.migrate(snapshot, context)

Migration strategy:

1. increment version when schema changes
2. convert legacy snapshots in migrate
3. fallback to safe defaults on invalid state

Restore lifecycle hooks expose restore status for analytics and diagnostics.