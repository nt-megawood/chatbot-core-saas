# Configuration

Core config is supplied through the ChatbotWidgetCore constructor.

## Core fields

- apiEndpoint
- socketUrl
- mode
- position
- title
- inputPlaceholder
- density
- themeVariant
- allowRuntimeModeSwitch

## Feature blocks

- entry
- starterPacks
- inputCard
- i18n
- storage
- presence
- lifecycle
- landscapePanel

## Behavior notes

- entry.requiredBeforeSend blocks free text until entry is submitted
- starterPacks.showBeforeFirstUserMessage controls pre-first-message visibility
- inputCard.submitBehavior controls auto-send behavior after card submit
- storage.version with storage.migrate enables schema evolution