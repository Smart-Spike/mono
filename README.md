### Mono

This repo is managed as a [monorepo](https://github.com/babel/babel/blob/master/doc/design/monorepo.md) that is composed of:

- **packages/***: a directory of publish-able packages that can we be shared between other packages and projects the same as any npm module
- **projects/***: a directory of web or native app projects that would tend to be deployed rather than published

The mono repo is managed by [Lerna](https://github.com/lerna/lerna) using [Yarn workspaces](https://yarnpkg.com/lang/en/docs/workspaces/).

### Getting started

#### Install any root dev dependencies and bootstrap all packages:

```bash
$ yarn install
$ npx lerna bootstrap
```

This will...

- install a local version of `lerna` and any other root level dev dependencies
- install all individual package dependencies (equivalent to `cd packages/<package> && yarn install`)
- symlink any inter-package or project dependencies e.g. from `packages/pkg-a` to `node_modules/@namespace/pkg-a`

---

*NOTE:* prefixing the command with [npx](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b) means that you don’t need to globally install lerna. 

---

#### Adding dependencies

Published dependencies from e.g. npm can be added to individual package(s) either by running the normal `yarn` commands inside the relevant package. It's recommended to re-run `npx lerna bootstrap` after doing this so that lerna can re-link any packages.

However to add a dependency to multiple packages/projects or to add a local package you can run:

`npx lerna add <package>[@version] [--dev] [--scope=<package|project>]`

E.g. to add `babel-cli` as a dev dependency to all packages you would run `npx lerna add babel-cli --dev`. Or to add it to only specific projects or packages you could run `npx lerna add babel-cli --scope=@namespace/pkg-a --scope=project-awesome`. Lerna can then make use of hoisting to move the dependency to the root level `node_modules` directory and avoid duplication.

#### Running npm scripts

Any package or project script can be run from the root by using:

`npx lerna run <script> -- [..args]`

For example to run the `test` script for a specific package you would use:

`npx lerna run test --scope=@mono/package-a`

If you omitted the `--scope` argument the test script would be run for all packages and projects.
