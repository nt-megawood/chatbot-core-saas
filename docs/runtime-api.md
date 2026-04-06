# Runtime API

Main runtime methods:

- mount(host)
- unmount()
- open(source?)
- close(source?)
- toggle()
- setMode(nextMode)
- sendMessage(text)
- clearConversation()
- dismissTeaser()

Getters:

- isWidgetOpen()
- getMode()
- getMessages()
- getConversationId()
- getConfig()

Guideline:

- Call mount once per host element
- Call unmount before removing host from DOM