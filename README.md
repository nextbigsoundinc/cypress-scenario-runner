Cypress Scenario Runner
===
This tool lets you run [Gherkin](https://docs.cucumber.io/gherkin/reference/) scenarios without writing any code.


Usage
---
Coming soon.


How it works
---
Coming soon.


Prerequisites
---
- Node 6+


Installation
---
#### 1. Install [Cypress](https://www.cypress.io/) and this package
```sh
npm install --save-dev cypress cypress-scenario-runner
```

#### 2. Launch Cypress at least once to create the initial `cypress/` directory structure
```sh
$(npm bin)/cypress open
```

#### 3. Run the installer
```sh
$(npm bin)/cypress-scenario-runner install [path]
```
where `[path]` is where your Cypress directory is if you moved it from its default `cypress/` location.

#### 4. Configure Cypress to include the correct assets

Add this to `package.json`:
```
  "cypress-cucumber-preprocessor": {
    "step_definitions": "cypress/steps/"
  }
```

Add this to `cypress/plugins/index.js`:
```js
const scenarioRunner = require('./cypress-scenario-runner/index');

module.exports = (on, config) => {
   scenarioRunner(on, config);
   ...
   return config;
};
```

Customize and rename `cypress/support/pages.example.js` and `cypress/support/users.example.js`, then add this to `cypress/support/index.js`:
```js
require('./pages');
require('./users');
require('./cypress-scenario-runner/index');
```


Configuration
---
This package adds several configuration settings:

Parameter | Default | Description
--- | --- | ---
`defaultCommandWait` | `0` | Number of milliseconds to wait before each scenario step. Useful if the UI needs a delay for DOM elements to update.
`elementAttributeName` | `data-test` | Name of the attribute whose value is used to match given/when/then steps
`valueAttributeName` | `data-test-val` | Name of the attribute whose value is used to match multi-checkbox inputs


Removal
---
```sh
$(npm bin)/cypress-scenario-runner uninstall
npm uninstall cypress-scenario-runner --save-dev
```
