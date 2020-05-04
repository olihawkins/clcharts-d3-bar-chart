# clcharts-d3-bar-chart

This is a template visualisation for an interactive and responsive bar chart in the House of Commons Library style. The chart is implemented using D3 and is built and bundled with webpack and babel.

## Installation

Clone this repository and install the node modules from package.json.

```bash
npm install
```

Alternatively you can setup the project from scratch and install the latest version of the packages by following the setup instructions below.

## Setup

1\. Clone this repository.

```sh
git clone https://github.com/olihawkins/clcharts-d3-bar-chart
```

2\. Rename the folder to your project name.

```sh
mv vis-template your-project-name
```

3\. Change into the project directory.

```sh
cd your-project-name
```

4\. Remove the git files.

```sh
rm -rf .git .gitignore LICENSE readme.md package.json package-lock.json
```

5\. Initialise the project folder with `npm` to create the `package.json`.

```sh
npm init
```

6\. Install the development dependencies.

```sh
npm install --save-dev babel-loader @babel/core @babel/preset-env @babel/plugin-transform-runtime webpack webpack-cli webpack-dev-server style-loader css-loader eslint whatwg-fetch d3
```

7\. Install the package dependencies.

```sh
npm install --save @babel/runtime @babel/runtime-corejs3
```

8\. Open `package.json` and add the following entries to `scripts` (above the entry for `test`).

```json
"build": "webpack",
"start": "webpack-dev-server --open",
```

9\. Start the webpack development server. This opens `dist/index.html` with a development build of the files in `src`. Changes to the source files trigger automatic reloading of the page.

```sh
npm run start
```

10\. Use webpack on its own to build the bundle when you are ready to deploy (see below).

```sh
npm run build
```
