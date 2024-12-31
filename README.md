# Entrance Challenge

This is an entrance challenge for software engineer applicants. Please carefully review the contents of this [README](https://en.wikipedia.org/wiki/README) file to gain insights into the project and understand the setup process. Detailed exercise instructions are provided in the [EXERCISES.MD](./docs/EXERCISES.md) file. Ensure thorough comprehension of this document before proceeding with the challenge.

## Intro

This file, along with other accompanying docs, are composed in [Markdown](https://en.wikipedia.org/wiki/Markdown). For a more readable format, consider using VSCode in [Markdown preview mode](https://code.visualstudio.com/docs/languages/markdown#_markdown-preview).

## Concepts

Familiarize yourself with the following concepts to enhance your understanding and successfully navigate this project.

### Programming Language

#### JavaScript

[JavaScript](https://en.wikipedia.org/wiki/JavaScript) is a dynamic programming language. It's the only programming language that can execute in the browser. That's why all frontend applications that run in the browser are written in JavaScript (or a superset of JavaScript, e.g., TypeScript). JavaScript, thanks to Node.js, can also execute on the server. That makes it viable for writing backend applications as well. Our project's frontend and backend are both written in a JavaScript superset called TypeScript.

#### TypeScript

The programming language used in this project is [TypeScript](https://www.typescriptlang.org/). TypeScript is a superset of JavaScript, i.e., it's JavaScript with additional syntax that allows us to [statically type](https://en.wikipedia.org/wiki/Type_system#STATIC) our code. Although it adds a learning curve, adding static typing to our JavaScript code results in a more robust codebase. While the code is written in TypeScript, it eventually gets compiled to JavaScript before executing. That means that TypeScript is only there to help us during development, but in reality we'd be executing plain old JavaScript.

### Frontend

#### React.js

[React.js](https://react.dev/) is a JavaScript framework for building web user interfaces. Through the concept of [Components](https://react.dev/learn/your-first-component), it provides us with the tools we need to organize and render UI elements on a page. Our project's frontend is built with React. You can learn React using [their official guide](https://react.dev/learn) or by taking an online course of your preference.

#### Tailwind

[Tailwind](https://tailwindcss.com/) is a utility-first CSS framework. It provides us with a list of utility [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) classes for rapid styling. Instead of writing CSS from scratch to style a page, you can use these utility classes to rapidly style your components. This [cheat sheet](https://tailwindcomponents.com/cheatsheet/) is useful for mapping Tailwind classes to CSS properties and vice versa.

#### Vite

We are using [Vite](https://vitejs.dev/) as the build tool for our React frontend. Build tools allow us to differentiate between the code we write and the code we deploy. For example, the build tool compiles our TypeScript code into JavaScript so it can run in the browser. In addition to being a build tool, Vite also acts as our React frontend's server during development.

### Backend

#### tRPC

This project's backend is written in [tRPC](https://trpc.io/). tRPC is a framework for building TypeScript backends. When building [Single Page Applications](https://en.wikipedia.org/wiki/Single-page_application), such as this project, we'd usually have an API for data communication between our frontend application and our backend. The API communication happens using [HTTP](https://en.wikipedia.org/wiki/HTTP), and the most common data format used for the transfer is usually [JSON](https://en.wikipedia.org/wiki/JSON). There are several design approaches for building APIs such as [REST](https://en.wikipedia.org/wiki/REST) or [GraphQL](https://graphql.org/). tRPC however uses a different approach called [RPC](https://en.wikipedia.org/wiki/Remote_procedure_call) that abstracts away network communication into simple function calls. The "t" in tRPC refers to TypeScript, and since this is a TypeScript framework, it also provides us with [type safety](https://en.wikipedia.org/wiki/Type_safety) between the frontend and backend.

#### SQLite

[SQLite](https://www.sqlite.org/) is a lightweight database management system that requires zero configuration. The main purpose
of SQLite is simplicity and ease of installation. While it can definitely be used in production, SQLite's simplicity may not always be the most suitable database for more complex applications. As this is only an exercise, we are using SQLite here to avoid the hassles of setting up a more complicated database such as [PostgreSQL](https://en.wikipedia.org/wiki/PostgreSQL). To browse the SQLite database you can download any SQLite browser like [DB Browser for SQLite](https://sqlitebrowser.org/) and open the `development.db` file once you've set up the database.

#### Drizzle

[Drizzle](https://orm.drizzle.team/) is the TypeScript [ORM](https://en.wikipedia.org/wiki/Object%E2%80%93relational_mapping) library used as an interface between our TypeScript backend and the SQLite database. ORMs are useful for abstracting some of the SQL statements in our code and make it easier to seamlessly integrate SQL with a specific codebase. The ORM you use depends heavily on what programming language you use. Drizzle is one of the more popular TypeScript ORMs.

### Tooling

#### Version Control

We are using [git](https://git-scm.com/) for version control. Version control allows us to track code changes in addition to making it easier for a team to work on the same codebase. Each exercise in this challenge should be committed with a message describing what was changed.

#### VSCode

Code editors are usually a matter of personal preference, especially with languages like JavaScript/TypeScript where even a simple text editor would be enough. More modern code editors however can definitely improve productivity by providing more features than just text editing. One of the most popular editors nowadays is [VSCode](https://code.visualstudio.com/) which we recommend to anyone taking this challenge. When you open this project in VSCode, it will automatically recommend installing [a list of extensions](./.vscode/extensions.json) - we recommend installing these extensions for easier development.

#### Monorepo

[Monorepos](https://en.wikipedia.org/wiki/Monorepo) are a way to group multiple applications or projects inside a single git repository. This is mostly useful if your project consists of multiple independent but related parts that often change together. This project is an example - the frontend is separate from the backend, but combined they form our application. We use [PnPM](https://pnpm.io/) to manage our monorepo.

#### Linting

[Linting](<https://en.wikipedia.org/wiki/Lint_(software)>) is a [static analysis](https://en.wikipedia.org/wiki/Static_program_analysis) tool that evaluates our code as we write it to try and catch any errors or bad patterns before running the program. The two linters that we use are [eslint](https://eslint.org/) and TypeScript itself. There are two ways to lint your code: in real time through code editor integration, or by running a command in the terminal. We recommend doing both, having real time linting in the code editor while writing code to warn you of errors as you write them, but also double checking you didn't miss anything before every commit by running the linting command in the terminal. You can check the Project Setup section to learn how to lint your code.

## About the Project

This project, called Timeout, is an Employee Leave Management System. Employees use it to request leaves such as vacations and sick leaves. Admins can use it to track their employees' leaves. The admin themself is also an employee and can therefore both request their own leaves and track leaves of other employees. When you open the app, you'll automatically be signed in as an admin (who's also an employee). The application has three main pages:

- **Dashboard**: the dashboard is useful for the current user, the employee, to quickly track the amount of leaves they've taken and the credit remaining.
- **Requests**: this table is used by the admin to track and manage all requested leaves by all employees.
- **Timesheet**: this page, accessible to all employees, is a calendar-like user interface displaying per-day leaves for all employees in the company.
- **Puzzles**: this page is unrelated to the application itself and is only used for puzzles at the end of the challenge.

## Project Architecture

The project is a TypeScript [Single Page Application](https://en.wikipedia.org/wiki/Single-page_application). It's split into two major parts, the React frontend and the tRPC backend.

- The React frontend is a React.js application that executes in the user's browser. This is the user interface you will see in the browser. Its code lives inside the `frontend` directory and is served as static files to the browser via Vite's server.
- The tRPC backend is an API that executes on a Node.js powered server. It is responsible for connecting with the database and providing the React frontend with the data it needs. The tRPC backend lives under the `backend` directory.

Communication between the `frontend` and the `backend` happens via HTTP requests containing JSON. That communication is abstracted away by tRPC into more-or-less simple and type safe function calls.

### React Frontend

- It uses the [TanStack Router](https://tanstack.com/router/v1) library as the application's router. The `router.tsx` file defines the route structure.
- It uses an integration between [tRPC client](https://trpc.io/docs/client/react) and [TanStack Query](https://tanstack.com/query/latest) to make API calls to the backend.
- The `app` folder contains the code for most of the application's layouts, pages, and components.
- The `utils` folder contains re-usable functions that may be used across the frontend application.

### tRPC Backend

- The `db` folder contains everything related to the SQLite database (and Drizzle).
- The `router` folder contains the different tRPC procedures, which are basically HTTP endpoints that the frontend would be calling.
- The `utils` folder contains re-usable functions that may be used across the backend application.

## Project Setup

### Prerequisites

You will need the following things properly installed on your computer.

- [Git](http://git-scm.com/) (latest version)
- [Node.js](http://nodejs.org/) (with NPM) (Node Version: 18.x)
- [pnpm](https://pnpm.io/) (latest version) (`npm install -g pnpm`)

### Installation

- Install the prerequisites listed above
- Download the repo and unzip it into a directory called `timeout-main`
- Go into the root directory `cd timeout-main`
- Initialize the git repository:
  - `git init`
  - `git config user.name 'Anonymous'`
  - `git config user.email '<>'`
  - `git add -A`
  - `git commit -m "Initial Commit"`
- Install dependencies `pnpm install`
- Set up the database `pnpm dev:setup`

### Development

#### Starting Servers

You will probably want to start both servers (frontend and backend) using `pnpm dev:all`.
If for some reason you want to start each server individually, you can use:

- `pnpm dev:frontend` for the frontend server
- `pnpm dev:backend` for the backend server

#### Open the frontend web app

The web page opens automatically when you start the server. If you ever want to open it manually, you can open the URL [http://localhost:5173](http://localhost:5173) in the browser.

#### Database

Whenever you want to reset the database to its original sample data, you can call `pnpm dev:setup` and restart the server.

If you ever want to run more fine-grained commands (rarely), cd into the `backend` directory:

- `db:migrate` to migrate the database after updating the schema
- `db:drop` to drop the database
- `db:seed` to populate the seed data. Seed data is the initial data needed in the database for the application to run correctly.
- `db:sample` to populate sample data. Sample data is fake data we populate the database with during development.

#### Linting

For real-time code editor linting, install the [VSCode eslint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) that's already listed in the [extension recommendation list](./.vscode/extensions.json).
To run ESlint and TypeScript in the terminal, call `pnpm lint`.
