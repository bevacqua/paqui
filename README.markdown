# Paqui

> Dead simple, packager-agnostic client-side package manager for component developers

## Installation

Get the CLI

```shell
npm i -g paqui
```

## `paqui init`

This command will guide you through a set of questions, and then create the bare bones structure for a client-side package.

## `paqui build`

Builds the package and produces a minified version, too.

## `paqui deploy`

This command publishes an updated version of our library (after internally running `paqui build`) to all of the configured package management systems.

## **.paquirc**

JSON configuration file defining the package management systems our package should be available on.
