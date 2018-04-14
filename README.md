# jupyterlab_clusters

IPyParallel interface for remote and local clusters

**This extension is under development and currently does just about nothing**

## Screenshot
![screenshot](extras/screenshot.png)


## Prerequisites

* JupyterLab

## Installation

```bash
jupyter labextension install jupyterlab_clusters
```

## Development

For a development install (requires npm version 4 or later), do the following in the repository directory:

```bash
npm install
npm run build
jupyter labextension link .
```

To rebuild the package and the JupyterLab app:

```bash
npm run build
jupyter lab build
```

