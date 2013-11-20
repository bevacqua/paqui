# Paqui

> Dead simple, packager-agnostic client-side package manager for component developers

## Installation

Get the CLI

```shell
npm i -g paqui
```

## `paqui init`

This command will guide you through a set of simple questions (with sensible defaults), and then create the structure you need to start building your newest client-side package. If you want to use paqui in an existing project, you can use `paqui init --existing`. You can specify a path where you'd like paqui to create the structure, otherwise paqui will use the `process.cwd()` default.

`paqui init foo` will create a foo directory relative to our `cwd`.




## `paqui build`

Builds the package and produces a minified version, too.

## `paqui deploy`

This command publishes an updated version of our library (after internally running `paqui build`) to all of the configured package management systems.

## **.paquirc**

JSON configuration file defining the package management systems our package should be available on.
