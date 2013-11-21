# Paqui

> Dead simple, packager-agnostic client-side package manager for component developers

## Installation

Get the CLI!

```shell
npm i -g paqui
```

## `paqui init`

This command will guide you through a set of simple questions _(with sensible defaults)_, and then create the structure you need to start building your newest client-side package. If you want to use paqui in an existing project, you can use `paqui init --existing`. You can specify a path where you'd like paqui to create the structure, otherwise paqui will use the `process.cwd()` default.

Using `paqui init foo` will create a foo directory, relative to our `cwd`, with everything we need.

![init.png][1]

Oh, yeah. If this directory wasn't an existing `git` repository, paqui will initialize that for you. If you don't want that behavior, that's fine. Just add the `--no-git` option.

## `paqui deploy`

This command publishes an updated version of our library (after internally running `paqui build`) to all of the configured package management systems.

## **.paquirc**

JSON configuration file defining the package management systems our package should be available on.

  [1]: http://i.imgur.com/Ce5FbvS.png
