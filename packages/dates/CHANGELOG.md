# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

<!-- ## Unreleased -->

## 0.5.6 - 2021-04-13

### Changed

- Removed dependency on tslib, as we no-longer compile with `tsc`. [#1829](https://github.com/Shopify/quilt/pull/1829)

## 0.5.3 - 2021-03-03

### Fixed

- Updated multi-build outputs to include mandatory extensions to fix "Module not found" issues reported by ESM supported bundlers [#1759](https://github.com/Shopify/quilt/pull/1759)

## 0.5.0 - 2020-12-18

### Added

- Add new build outputs (CommonJS, ESM, esnext, Node) for greater tree-shakability [#1698](https://github.com/Shopify/quilt/pull/1698)

## 0.4.3 - 2020-10-20

- Updated `tslib` dependency to `^1.14.1`. [#1657](https://github.com/Shopify/quilt/pull/1657)

## 0.4.0 - 2020-06-04

### Added

- Added `isLessThanOneWeekAway` and `isLessThanOneYearAgo` functions [[#1438](https://github.com/Shopify/quilt/pull/1438)]

## 0.3.4 - 2020-03-13

### Added

- Added `getIanaTimeZone` and exposed `memoizedGetDateTimeFormat` ([#1367](https://github.com/Shopify/quilt/pull/1367))

## 0.3.1 - 2020-02-27

### Fixed

- Allows `hour12: true` to be passed to `formatDate` ([#1299](https://github.com/Shopify/quilt/pull/1299))

## 0.3.0 - 2020-02-19

- Export the `formatDate` function so it can be used by other packages / projects, e.g. in `@shopify/react-i18n` ([#1286](https://github.com/Shopify/quilt/pull/1286))

## 0.2.13 - 2020-02-07

- Fixes the memory leak that was introduced in v0.1.27 when server-side rendering ([#1277](https://github.com/Shopify/quilt/pull/1277))

## 0.2.12 - 2020-02-07

- ⚠️ A bug fix because Chrome 80's API change to Intl.DateTimeFormat ([#1266](https://github.com/Shopify/quilt/pull/1266))

## 0.2.11 - 2020-01-31

- Specify package has no `sideEffects` ([#1233](https://github.com/Shopify/quilt/pull/1233))

## 0.2.0 - 2019-09-13

### Added

- Add `isLessThanOneMinute`, `isLessThanOneHour`, `isLessThanOneDay`, `isLessThanOneWeek`, and `isLessThanOneYear` functions ([#989](https://github.com/Shopify/quilt/pull/989))

## 0.1.15 - 2019-04-17

### Changed

- Improve performance of `formatDate` to use memoized `DateTimeFormat`. ([#643](https://github.com/Shopify/quilt/pull/643))

## 0.1.7 - 2019-01-09

- Start of Changelog
