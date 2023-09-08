# Szymon showcase Playwright Test Project

This project utilizes [Playwright Test](https://playwright.dev/docs/test-intro), a part of the Playwright ecosystem, to run browser tests with various configurations including with UI and in headed or headless modes. You can toggle between these configurations using the npm scripts provided in the `package.json` file.

## Setup

Before you begin, ensure that [Node.js](https://nodejs.org/) is installed on your system. Then, install the necessary dependencies using the following command:

```sh
npm install
```

## Running the Tests

You can run the tests using the following npm scripts defined in the `package.json` file:

### Default Test Mode

To run the tests in the default mode, use the following command:

```sh
npm run test
```

### No - Headed Test Mode

To run the tests in no headed mode

```sh
npm run test
npm run test-ui
```

### Headed Test Mode

To run the tests in headed mode

```sh
npm run test-headed
npm run test-headed-ui
```

## Writing Tests

Write your tests according to the Playwright Test documentation and place them in the appropriate directory (usually a directory named `tests` or `src/tests`). You can then run them using the npm scripts mentioned above.

## Code Formatting

This project utilizes [Prettier](https://prettier.io/) to maintain a consistent code style. It's recommended to adhere to this format to maintain consistency throughout the codebase. If you are planning to contribute, please ensure your code is formatted according to Prettier's rules.

You can format your code by running the following command in the terminal:

```sh
prettier --write .
```

## Reporting Issues

If you encounter any issues while using this project, please open an issue on the GitHub repository.

## Contributing

If you'd like to contribute to this project, please fork the repository, create a new branch for your work, and submit a pull request.

## License

This project is licensed under the ISC license.
