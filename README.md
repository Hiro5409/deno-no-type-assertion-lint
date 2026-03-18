# @hiro5409/deno-no-type-assertion-lint

[![JSR](https://jsr.io/badges/@hiro5409/deno-no-type-assertion-lint)](https://jsr.io/@hiro5409/deno-no-type-assertion-lint)
[![JSR Score](https://jsr.io/badges/@hiro5409/deno-no-type-assertion-lint/score)](https://jsr.io/@hiro5409/deno-no-type-assertion-lint)

Deno lint plugin that forbids TypeScript type assertions (`as` and angle-bracket
syntax). `as const` / `<const>` is allowed.

The only dedicated no-type-assertion plugin on JSR — bans both `as` and
angle-bracket syntax in one package.

Inspired by `@typescript-eslint/consistent-type-assertions`
(`assertionStyle: "never"`) and `oxc/consistent-type-assertions` (error
message), implemented as a native Deno lint plugin.

## Install

Requires Deno 2.2.0 or newer.

```jsonc
// deno.json
{
  "lint": {
    "plugins": ["jsr:@hiro5409/deno-no-type-assertion-lint"]
  }
}
```

## Why?

Type assertions tell TypeScript to trust you instead of proving the type. They
can hide real type errors, especially around object literals, DOM APIs, and
untyped data.

This rule nudges code toward:

- explicit type annotations
- `satisfies` for shape checking
- type guards when runtime narrowing is actually needed

## Examples

```typescript
// Bad — compiler won't catch missing fields
const user = {} as { name: string; email: string };

// Good — type annotation catches missing fields at compile time
const user: { name: string; email: string } = { name: "alice", email: "a@b.c" };

// Good — satisfies checks conformance without changing the inferred type
type Route = "home" | "about" | "contact";
const paths = {
  home: "/",
  about: "/about",
  contact: "/contact",
} satisfies Record<Route, string>;

// Good — as const and as const satisfies are allowed by this rule
const ROLES = ["admin", "user"] as const;
const config = { debug: false } as const satisfies { debug: boolean };
```

## Ignoring a report

```typescript
// deno-lint-ignore no-type-assertion/no-type-assertion -- API returns untyped JSON
const data = await response.json() as UserProfile;
```

## License

MIT
