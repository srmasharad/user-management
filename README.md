# User Management with Supabase

A simple user management application created using Vite, React with Typescript, and Supabase.

## Overview

The application allows you to manage employee information, such as their name, email, and role, using a user-friendly interface. Also you can create a team and assign a employee to the team.

## Features

- Add new employee with details such as name, email, phone, address, date of birth, billable hours, etc.
- View a list of all employees and team.
- Edit or delete existing employees and team.
- User-friendly and responsive UI for easy navigation and interaction.

## Packages Used

- [Vite](https://vitejs.dev/guide/): The application is built using Vite, a fast and lightweight development server and build tool for modern web development.
- [Radix UI](https://radix-ui.com/): A collection of React UI components for building accessible and customizable interfaces.
- [React Hook Form](https://react-hook-form.com/): A flexible and performant form validation library for React.
- [Supabase](https://supabase.io/): An open-source alternative to Firebase for building backend systems.
- [Tanstack Query](https://tanstack.com/query): A data-fetching library for React applications that simplifies data management and provides caching and real-time updates.
- [Class Variance Authority](https://cva.style/docs): A package for handling class variance in TypeScript.
- [Clsx](https://www.npmjs.com/package/clsx): A utility for constructing class names conditionally in JavaScript and TypeScript.
- [Date-fns](https://date-fns.org/): A library for manipulating and formatting dates in JavaScript and TypeScript.
- [Lucide React](https://lucide.dev/): A library of colorful and customizable icons for React applications.
- [React Hot Toast](https://react-hot-toast.com/): A lightweight toast notification library for React applications.
- [React Router DOM](https://reactrouter.com/): A library for routing and navigation in React applications.
- [Tailwind CSS](https://tailwindcss.com/): A utility-first CSS framework for building responsive and modern web interfaces.
- [Zod](https://github.com/colinhacks/zod): A TypeScript-first schema validation library.

## Installation

1. Clone the repository.
2. Navigate to the project directory.
3. Install dependencies using `yarn` or `npm` with the following command:

```shell
npm install
```

or

```shell
yarn install
```

Create a `.env` file and add your Supabase credentials as environment variables.

```shell
VITE_SUPABASE_URL=https://[YOUR_PROJECT_ID].supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

Run the development server with the following command:

```shell
npm run dev
```

Access the application in your browser at `http://localhost:5173`.

## Credits

The application is developed and maintained by **Sharad Sharma** and contributions from the open-source community.
