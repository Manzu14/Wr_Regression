# Playwright Boilerplate Project with Examples

This project serves as a boilerplate for setting up Playwright tests in JavaScript. It includes examples covering various aspects of testing such as using page objects, parametrized tests, test steps, mocks, grep, API testing, faker, console log integration, and axe-core integration.

## Table of Contents

- [Setup](#setup)
- [Installation](#installation)
- [Usage](#usage)
    - [Running Tests](#running-tests)
    - [Examples](#examples)
- [Contributing](#contributing)

## Setup

To use this boilerplate project, make sure you have Node.js installed on your machine.

- install Node version manager (NVM)
- use NVM to install and manage your node versions

## Installation

1. Clone this repository:

```bash
git clone <repository_url>
```

2. Navigate into the project directory:

```bash
cd core-pw-js
```

3. Install the dependencies:

```bash
npm install
```

## Usage

### Running Tests

To run the tests, execute the following command:

```bash
npx playwright test
```

### Conditional test skip

Sometimes test designed only for specific country/market or agent. In such cases tags could be used to identify those conditions when test should be skipped.

For example if test should not be executed for `BE` market - @skip_be tag should be added to the test or entire descibe.

| condition parameter | tag prefix            | possible values                   | examples         |
| ------------------- | --------------------- | --------------------------------- | ---------------- |
| country             | `@skip_${COUNTRY}`    | COUNTRY: 'be', 'nl', 'ma', 'fr'   | `@skip_nl`       |
| agent type          | `@skip_${AGENT_TYPE}` | AGENT_TYPE: '3rdparty', 'inhouse' | `@skip_3rdparty` |

### Test and Structure examples

This project includes examples covering various aspects of Playwright testing:

- **Page Objects:** Demonstrates organizing tests using page objects for better maintainability and readability.

```bash
page-object.spec.js
```

- **Parametrized Tests:** Shows how to write tests that accept parameters for different test scenarios.

```bash
parametrized-test.spec.js
```

- **Test Steps:** Illustrates breaking down tests into smaller steps for better readability and reusability.

```bash
test-steps.spec.js
```

- **Mocks:** Demonstrates how to use mocks for mocking external dependencies during testing.

```bash
mock.spec.js
```

- **Grep:** Shows how to run specific tests matching a given pattern using grep.

```bash
grep.spec.js
```

> The below examples show off different ways to trigger different tests based on different inputs.

```bash
// Runs both Test A and Test B
$ npx playwright test -g @1

// Runs only Test A
$ npx playwright test -g @2

// Runs only Test B
$ npx playwright test -g @3

// Runs only Test A
$ npx playwright test -g @1 --grep-invert @3

// Runs only Test B (note grep is case sensative)
$ npx playwright test -g B

// Runs  both Test A and Test B (this triggered off of the test.describe title)
$ npx playwright test -g scribe

// runs both Test A and Test B
$ npx playwright test -g "@2|@3"
```

- **API Testing:** Includes examples of integrating API testing within Playwright tests.

- **Faker:** Demonstrates using Faker library to generate test data.

```
faker.spec.js
faker-seed.spec.js
```

- **Console Log Integration:** Shows how to capture console logs during tests for debugging purposes.

```
console-log.spec.js
```

- **Axe-core Integration:** Illustrates integrating axe-core for accessibility testing within Playwright tests.

```
axe-core.spec.js
```

## CI/CD

This project use predefined GitLab CI/CD templates from `core-pipeline` project.

More information about CI/CD configuration could be found [here](https://source.tui/osp/tech-practices/qa/qmo/boiler/core-pipeline/-/blob/main/README.md).

## Gitlab runners:

Service Hours:

- Monday to Friday
  From 05:00 CEST to 20:00 CEST.
  04:00 to 19:00 BST
  03:00 to 18:00 GMT

## Renovate

This tool provides automated dependency checks and will automatically
create a pull request for each dependency that can be updated. By default
it is up to the members of the project to approve and deliver these pull requests, although they can be configured to merge automatically.

Configuration: 'renovate.json'

If changes are made to the configuration you can use a checker to ensure any changes are valid.

To check any changes to the renovate configuration use the validator tool:

```
$npx --yes --package renovate -- renovate-config-validator
INFO: Validating renovate.json
INFO: Config validated successfully
```

## Contributing

Contributions to this project are welcome! If you have any improvements, bug fixes, or new examples to add, feel free to open a pull request.

Before contributing, make sure to follow these guidelines:

1. Create a new branch for your changes:

```bash
git checkout -b feature/my-feature
```

2. Make your changes and commit them:

```bash
git commit -am "Add new feature"
```

3. Push your changes to your fork:

```bash
git push origin feature/my-feature
```

4. Finally, open a pull request from your branch to the main repository's master branch.

# core-pw-js
