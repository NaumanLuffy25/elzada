# Styles folder

This folder is reserved for additional global / partial CSS files or design tokens that you might want to import alongside `app/globals.css`.

By default, Tailwind handles all styling through `app/globals.css` and the `tailwind.config.ts` theme tokens. If you want to opt out of utility classes for a particular section (e.g. print stylesheets, dark/light mode toggles, email templates), drop those stylesheets here and import them from the relevant layout.

Example:

```ts
// app/layout.tsx
import "@/styles/print.css";
```

Keeping this folder makes it easy to grow the design system without polluting `app/`.
