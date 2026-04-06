<a id="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<br />
<div align="center">
  <h3 align="center">ConversaCore</h3>

  <p align="center">
    Tenant-neutral chatbot widget runtime for SaaS implementations.
    <br />
    <a href="./docs/README.md"><strong>Explore the docs</strong></a>
    <br />
    <br />
    <a href="https://nt-megawood.github.io/chatbot-core-saas/dist/index.js">Live artifact</a>
    &middot;
    <a href="https://github.com/nt-megawood/chatbot-core-saas/issues">Report Bug</a>
    &middot;
    <a href="https://github.com/nt-megawood/chatbot-core-saas/issues">Request Feature</a>
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#built-with">Built With</a></li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#project-boundary">Project Boundary</a></li>
    <li><a href="#documentation">Documentation</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>

## About The Project

ConversaCore is the reusable runtime core for chatbot widget experiences.

It contains:

- UI shell and rendering (normal and landscape modes)
- transport abstraction and adapters
- message state and action model
- session restore and migration hooks
- i18n and lifecycle extension points

It deliberately does not contain company branding or business-specific workflows.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Built With

- TypeScript
- Vitest
- Browser ESM distribution

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Installation

1. Clone the repository
2. Install dependencies

```sh
npm install
```

3. Run checks

```sh
npm run typecheck
npm run test
npm run build
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage

```ts
import { ChatbotWidgetCore } from "chatbot-core-saas";

const widget = new ChatbotWidgetCore({
  apiEndpoint: "https://example.com/chat",
  socketUrl: "wss://example.com/chat"
});

widget.mount(document.getElementById("chat-root") as HTMLElement);
```

For deeper examples, see the docs index.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Project Boundary

Included in this core:

- generic widget behavior reusable across tenants
- runtime APIs and extension contracts

Not included in this core:

- company logos/tone/campaign copy
- dealer/planner business logic
- tenant-specific analytics schemas

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Documentation

- [Documentation index](docs/README.md)
- [Quickstart](docs/quickstart.md)
- [Configuration](docs/configuration.md)
- [Runtime API](docs/runtime-api.md)
- [Transport adapters](docs/transport.md)
- [Entry, starters and input cards](docs/entry-starters-cards.md)
- [i18n](docs/i18n.md)
- [Lifecycle hooks](docs/lifecycle-hooks.md)
- [Panel extension contract](docs/panel-extension.md)
- [Session restore and migration](docs/session-restore.md)
- [Security and repo policy](docs/security-and-repo-policy.md)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Roadmap

- [ ] Expand versioned migration examples
- [ ] Add additional transport examples
- [ ] Add public changelog discipline

See the [open issues](https://github.com/nt-megawood/chatbot-core-saas/issues) for tracked work.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contributing

Contributions are welcome.

1. Fork the Project
2. Create your Feature Branch
3. Commit your Changes
4. Push to the Branch
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## License

Distributed under the MIT License.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS -->
[contributors-shield]: https://img.shields.io/github/contributors/nt-megawood/chatbot-core-saas.svg?style=for-the-badge
[contributors-url]: https://github.com/nt-megawood/chatbot-core-saas/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/nt-megawood/chatbot-core-saas.svg?style=for-the-badge
[forks-url]: https://github.com/nt-megawood/chatbot-core-saas/network/members
[stars-shield]: https://img.shields.io/github/stars/nt-megawood/chatbot-core-saas.svg?style=for-the-badge
[stars-url]: https://github.com/nt-megawood/chatbot-core-saas/stargazers
[issues-shield]: https://img.shields.io/github/issues/nt-megawood/chatbot-core-saas.svg?style=for-the-badge
[issues-url]: https://github.com/nt-megawood/chatbot-core-saas/issues
[license-shield]: https://img.shields.io/github/license/nt-megawood/chatbot-core-saas.svg?style=for-the-badge
[license-url]: https://github.com/nt-megawood/chatbot-core-saas/blob/main/LICENSE
