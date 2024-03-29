# Vite Electron Builder Boilerplate

----

[![GitHub issues by-label](https://img.shields.io/github/issues/cawa-93/vite-electron-builder/help%20wanted?label=issues%20need%20help&logo=github)](https://github.com/cawa-93/vite-electron-builder/issues?q=label%3A%22help+wanted%22+is%3Aopen+is%3Aissue)
[![Required Node.JS >= v16.13](https://img.shields.io/static/v1?label=node&message=%3E=16.13&logo=node.js&color)](https://nodejs.org/about/releases/)
[![Required npm >= v8.1](https://img.shields.io/static/v1?label=npm&message=%3E=8.1&logo=npm&color)](https://github.com/npm/cli/releases)

> Vite+Electron = 🔥

This is template for secure electron applications. Written following the latest safety requirements, recommendations and best practices.

Under the hood is used [Vite] — superfast, nextgen bundler, and [electron-builder] for compilation.


## Get started

Follow these steps to get started with this template:

1. Click the **[Use this template](https://github.com/cawa-93/vite-electron-builder/generate)** button (you must be logged in) or just clone this repo.
2. If you want to use another package manager don't forget to edit [`.github/workflows`](/.github/workflows) -- it uses `npm` by default.

That's all you need. 😉

**Note**: This template uses npm v7 feature — [**Installing Peer Dependencies Automatically**](https://github.com/npm/rfcs/blob/latest/implemented/0025-install-peer-deps.md). If you are using a different package manager, you may need to install some peerDependencies manually.


**Note**: Find more useful forks [here](https://github.com/cawa-93/vite-electron-builder/discussions/categories/forks).


## Features

### Electron [![Electron version](https://img.shields.io/github/package-json/dependency-version/cawa-93/vite-electron-builder/dev/electron?label=%20)][electron]
- This template uses the latest electron version with all the latest security patches.
- The architecture of the application is built according to the security [guides](https://www.electronjs.org/docs/tutorial/security) and best practices.
- The latest version of the [electron-builder] is used to compile the application.


### Vite [![Vite version](https://img.shields.io/github/package-json/dependency-version/cawa-93/vite-electron-builder/dev/vite?label=%20)][vite]
- [Vite] is used to bundle all source codes. This is an extremely fast packer that has a bunch of great features. You can learn more about how it is arranged in [this](https://youtu.be/xXrhg26VCSc) video.
- Vite [supports](https://vitejs.dev/guide/env-and-mode.html) reading `.env` files. You can also specify types of your environment variables in [`types/env.d.ts`](types/env.d.ts).
- Hot reloads for `Main` and `Renderer` processes.

Vite provides many useful features, such as: `TypeScript`, `TSX/JSX`, `CSS/JSON Importing`, `CSS Modules`, `Web Assembly` and much more.

[See all Vite features](https://vitejs.dev/guide/features.html).


### TypeScript [![TypeScript version](https://img.shields.io/github/package-json/dependency-version/cawa-93/vite-electron-builder/dev/typescript?label=%20)][typescript] (optional)
- The latest version of TypeScript is used for all the source code.
- **Vite** supports TypeScript out of the box. However, it does not support type checking.
- Code formatting rules follow the latest TypeScript recommendations and best practices thanks to [@typescript-eslint/eslint-plugin](https://www.npmjs.com/package/@typescript-eslint/eslint-plugin).

**[See this discussion](https://github.com/cawa-93/vite-electron-builder/discussions/339)** if you want completely remove TypeScript.


### Vue [![Vue version](https://img.shields.io/github/package-json/dependency-version/cawa-93/vite-electron-builder/vue?label=%20&)][vue] (optional)
- By default, web pages are built using [Vue]. However, you can easily change that. Or not use additional frameworks at all.
- Code formatting rules follow the latest Vue recommendations and best practices thanks to [eslint-plugin-vue].
- Installed [Vue.js devtools beta](https://chrome.google.com/webstore/detail/vuejs-devtools/ljjemllljcmogpfapbkkighbhhppjdbg) with Vue 3 support.

See [examples of web pages for different frameworks](https://github.com/vitejs/vite/tree/main/packages/create-vite).

### Continuous Integration
- The configured workflow will check the types for each push and PR.
- The configured workflow will check the code style for each push and PR.
- **Automatic tests** used [Vitest ![Vitest version](https://img.shields.io/github/package-json/dependency-version/cawa-93/vite-electron-builder/dev/vitest?label=%20&color=yellow)][vitest] -- A blazing fast test framework powered by Vite.
  - Unit tests are placed within each package and run separately.
  - End-to-end tests are placed in the root [`tests`](tests) directory and use [playwright].



### Continuous delivery
- Each time you push changes to the `main` branch, the [`release`](.github/workflows/release.yml) workflow starts, which creates a release draft.
  - The version is automatically set based on the current date in the format `yy.mm.dd-minutes`.
  - Notes are automatically generated and added to the release draft.
  - Code signing supported. See [`compile` job in the `release` workflow](.github/workflows/release.yml).
- **Auto-update is supported**. After the release is published, all client applications will download the new version and install updates silently.

## How it works
The template requires a minimum amount [dependencies](package.json). Only **Vite** is used for building, nothing more.

### Project Structure

The structure of this template is very similar to the structure of a monorepo.

```mermaid
flowchart TB;

packages/preload <-. IPC Messages .-> packages/main

subgraph packages/main
M[index.ts] --> EM[Electron Main Process Modules]
M --> N2[Node.js API]
end


subgraph packages/preload
P[index.ts] --> N[Node.js API]
P --> ED[External dependencies]
P --> ER[Electron Renderer Process Modules]
end


subgraph packages/renderer
R[index.html] --> W[Web API]
R --> BD[Bundled dependencies]
R --> F[Web Frameforks]
end

packages/renderer -- Call Exposed API --> P
```

The entire source code of the program is divided into three modules (packages) that are each bundled independently:
- [`packages/renderer`](packages/renderer). Responsible for the contents of the application window. In fact, it is a regular web application. In developer mode, you can even open it in a browser. The development and build process is the same as for classic web applications. Access to low-level API electrons or Node.js is through the _preload_ layer.
- [`packages/preload`](packages/preload). Acts as an intermediate link between the _renderer_ layer and the low-level API electrons or Node.js. Runs in an _isolated browser context_, but has direct access to Node.js api. See [Checklist: Security Recommendations](https://www.electronjs.org/docs/tutorial/security#2-do-not-enable-nodejs-integration-for-remote-content).
- [`packages/main`](packages/main)
  Electron [**main script**](https://www.electronjs.org/docs/tutorial/quick-start#create-the-main-script-file).


### Build web resources

The `main` and `preload` packages are built in [library mode](https://vitejs.dev/guide/build.html#library-mode) as it is simple javascript.
The `renderer` package builds as a regular web app.


### Compile App
The next step is to package and compile a ready to distribute Electron app for macOS, Windows and Linux with "auto update" support out of the box.

To do this using the [electron-builder]:
- Using the npm script `compile`: This script is configured to compile the application as quickly as possible. It is not ready for distribution, it is compiled only for the current platform and is used for debugging.
- Using GitHub Actions: The application is compiled for any platform and ready-to-distribute files are automatically added as a draft to the GitHub releases page.

### Working with dependencies
Because the `renderer` works and builds like a _regular web application_, you can only use dependencies that support the browser or compile to a browser-friendly state.

This means that in the `renderer` you are free to use dependencies such as Vue, React, lodash, axios and so on. But you can't use, say, systeminformation or  pg because these dependencies need access to a node api to work, which is not available in the `renderer` context.

All dependencies that require node.js api can be used in the [`preload` script](https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts).

Here is an example. Let's say you need to read some data from the file system or database in the renderer.

In preload context create a method that reads and return data. To make the method announced in the preload available in the render, you usually need to call the [`electron.contextBridge.exposeInMainWorld`](https://www.electronjs.org/ru/docs/latest/api/context-bridge). However, this template uses the [unplugin-auto-expose](https://github.com/cawa-93/unplugin-auto-expose) plugin, so you just need to export the method from the preload. The `exposeInMainWorld` will be called automatically.
```ts
// preload/index.ts
import {writeFile} from 'fs'

// Everything you exported from preload/index.ts may be called in renderer
export function getData() {
  return /* ... */
}
```
Now you can import and call the method in renderer
```ts
// renderer/somewere.component.ts
import {getData} from '#preload'
const dataFromFS = getData()
```

[Read more about Security Considerations](https://www.electronjs.org/docs/tutorial/context-isolation#security-considerations).

### Working with Electron API
Although the preload has access to Node.js API, it **still runs in the BrowserWindow context**, so a limited electron modules are available in it. Check the [electron docs](https://www.electronjs.org/ru/docs/latest/api/clipboard) for full list of available methods.

All other electron methods can be invoked in the `main`.

As a result, the architecture of interaction between all modules is as follows:

```mermaid
sequenceDiagram
renderer->>+preload: Read data from file system
preload->>-renderer: Data
renderer->>preload: Maximize window
activate preload
preload-->>main: Invoke IPC command
activate main
main-->>preload: IPC response
deactivate main
preload->>renderer: Window maximized
deactivate preload
```
[Read more aboud Inter-Process Communication](https://www.electronjs.org/docs/latest/tutorial/ipc)


### Modes and Environment Variables
All environment variables set as part of the `import.meta`, so you can access them as follows: `import.meta.env`.

If you are using TypeScript and want to get code completion you must add all the environment variables to the [`ImportMetaEnv` in `types/env.d.ts`](types/env.d.ts).

The mode option is used to specify the value of `import.meta.env.MODE` and the corresponding environment variables files that need to be loaded.

By default, there are two modes:
- `production` is used by default
- `development` is used by `npm run watch` script

When running the build script, the environment variables are loaded from the following files in your project root:

```
.env                # loaded in all cases
.env.local          # loaded in all cases, ignored by git
.env.[mode]         # only loaded in specified env mode
.env.[mode].local   # only loaded in specified env mode, ignored by git
```

To prevent accidentally leaking env variables to the client, only variables prefixed with `VITE_` are exposed to your Vite-processed code. e.g. the following file:

```
DB_PASSWORD=foobar
VITE_SOME_KEY=123
```
Only `VITE_SOME_KEY` will be exposed as `import.meta.env.VITE_SOME_KEY` to your client source code, but `DB_PASSWORD` will not.


## Contribution

See [Contributing Guide](contributing.md).


[vite]: https://github.com/vitejs/vite/
[electron]: https://github.com/electron/electron
[electron-builder]: https://github.com/electron-userland/electron-builder
[vue]: https://github.com/vuejs/vue-next
[vue-router]: https://github.com/vuejs/vue-router-next/
[typescript]: https://github.com/microsoft/TypeScript/
[playwright]: https://playwright.dev
[vitest]: https://vitest.dev
[vue-tsc]: https://github.com/johnsoncodehk/vue-tsc
[eslint-plugin-vue]: https://github.com/vuejs/eslint-plugin-vue
[cawa-93-github]: https://github.com/cawa-93/
[cawa-93-sponsor]: https://www.patreon.com/Kozack/
