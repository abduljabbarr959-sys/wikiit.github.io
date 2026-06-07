# React

**React** is a JavaScript library for building user interfaces, developed by Meta (Facebook). It was first released in 2013 and has become one of the most widely used front-end frameworks.

## Core Concepts

### Components
React applications are built from reusable **components** — self-contained pieces of UI:

```jsx
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}
```

### JSX
A syntax extension that looks like HTML but lives inside JavaScript:

```jsx
const element = <h1 className="title">Hello</h1>;
```

### State & Hooks
Components can manage internal state:

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

## Virtual DOM

React maintains a lightweight virtual representation of the DOM. When state changes, React computes the difference (diffing) and efficiently updates only what changed in the real DOM.

## Why React?

- **Declarative** — Describe what you want, not how to do it
- **Component-Based** — Encapsulated components manage their own state
- **Huge Ecosystem** — React Router, Next.js, TanStack Query, and more

## This Project

This wiki's frontend is built with **React 18** and **TypeScript**, using Vite for development and build tooling.

See also: [HTML](/wiki/HTML), [CSS](/wiki/CSS), [Django](/wiki/Django)
