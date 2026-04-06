# Panel extension contract

Landscape panel extension enables side-panel workflows without embedding business logic into core.

Contract shape includes:

- id
- contractVersion
- render(context)
- bind(context)
- onError(error, context)

Guideline:

- core owns lifecycle and mounting
- company implementation owns panel business behavior