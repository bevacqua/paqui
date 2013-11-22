# Paqui

> Dead simple, packager-agnostic client-side package manager for component developers

![paqui.png][1]

## Installation

Get the CLI!

```shell
npm i -g paqui
```

## `paqui init`

This command will guide you through a set of simple questions _(with sensible defaults)_, and then create the structure you need to start building your newest client-side package. If you want to use Paqui in an existing project, you can use `paqui init --existing`. You can specify a path where you'd like Paqui to create the structure, otherwise it will use the `process.cwd()` default.

Using `paqui init foo` will create a foo directory, relative to our `cwd`, with everything we need.

![init.png][2]

Oh, yeah. If this directory wasn't an existing `git` repository, Paqui will initialize that for you. If you don't want that behavior, that's fine. Just add the `--no-git` option.

## `paqui deploy`

This command publishes an updated version of our library to all of the package management systems we've picked.

![deploy.png][3]

# Extending Paqui

> Paqui is designed to be easily extendable. You can create your own plugins to serve unsupported package managers, transform your source-code in innovative and revolutionary ways, and transport the code in some other way than merely writing to a file.

- More info on extending Paqui coming soon.

If you want Paqui to support a different license template, just submit a pull request my way!

  [1]: http://i.imgur.com/AksDJZW.png
  [2]: http://i.imgur.com/Ce5FbvS.png
  [3]: http://i.imgur.com/hE2DgUr.png
