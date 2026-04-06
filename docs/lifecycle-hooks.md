# Lifecycle and analytics hooks

Lifecycle hooks provide event-based observability.

Core categories:

- initialization
- open and close
- message and stream updates
- entry and starter interactions
- input-card submissions
- assistant actions
- session restore
- presence updates

Guideline:

- emit analytics from company layer
- keep core hooks generic and schema-stable