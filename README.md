# appkit

[![codecov](https://codecov.io/gh/appist/appkit/branch/main/graph/badge.svg?token=VD7K1YEwf9)](https://codecov.io/gh/appist/appkit)

An opinionated productive Typescript-first web framework to supercharge your feature development.

> Note: Only supported on Linux/MacOS. For Windows users, please use WSL2.

## Getting Started

```
// Install project's global tooling.
$ make init

// Install project's dependencies.
$ npm i

// Run `tsc` with watch mode to continously compile the framework's TS code
// to be used in `demo` project.
$ npm run build -- -w

// Start developing with `demo` project.
$ cd demo && ./app start
```

## Roadmap

cmd

- app starter template with npm init
- worker - add bullmq (support development mode with app:dev)
- cfg:enc - encrypt/append config value into <APPKIT_ENV>.env
- cfg:dec - decrypt config value from <APPKIT_ENV>.env
- db:new - add new database
- build --docker - dockerise the app for production deployment
- start --docker - build and run the app in docker container

core

- support file based routing
- integrate with vitejs to support svelte SSR + service worker
- support i18n
- support mailer
- support casbin
- support graphql
- support swagger with openapi 3
- support opentracing

## Credits

This project is heavily inspired by:

- [Rails](https://rubyonrails.org/)
- [SvelteKit](https://kit.svelte.dev/)
- [ViteJS](https://vitejs.dev/)
