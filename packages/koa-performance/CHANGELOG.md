# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

<!-- ## Unreleased -->

## 1.4.1 - 2021-04-13

### Changed

- Removed dependency on tslib, as we no-longer compile with `tsc`. [#1829](https://github.com/Shopify/quilt/pull/1829)

## 1.4.0 - 2021-03-23

### Added

- Adds the ability to pass custom tags to additional navigation metrics [#1792](https://github.com/Shopify/quilt/pull/1792)

## 1.3.2 - 2021-03-03

### Fixed

- Updated multi-build outputs to include mandatory extensions to fix "Module not found" issues reported by ESM supported bundlers [#1759](https://github.com/Shopify/quilt/pull/1759)

## 1.3.0 - 2020-12-18

### Added

- Add new build outputs (CommonJS, ESM, esnext, Node) for greater tree-shakability [#1698](https://github.com/Shopify/quilt/pull/1698)

## 1.2.8 - 2020-10-20

- Added `tslib@^1.14.1` in the list of dependencies. [#1657](https://github.com/Shopify/quilt/pull/1657)

## 1.2.0 - 2020-02-05

### Added

- Middleware now adds a `locale` tag to distributions (if provided) [#1260](https://github.com/Shopify/quilt/pull/1260)

## 1.1.0 - 2019-10-25

### Added

- `clientMetricsMiddleware` no longer requires `development?` to be explicitly set in it's `options` parameter. If the parameter is missing it will default to `true` when `process.env.NODE_ENV` is `true`, and `false` otherwise.

## 1.0.0 - 2019-10-08

### Added

- `@shopify/koa-performance` package [#1095](https://github.com/Shopify/quilt/pull/1095)
