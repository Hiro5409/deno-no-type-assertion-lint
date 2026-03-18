import { assertEquals, assertExists } from "@std/assert";
import plugin from "./mod.ts";

Deno.test("reports `as` type assertion", () => {
  const d = Deno.lint.runPlugin(
    plugin,
    "test.ts",
    `const x = "hello" as unknown;`,
  );
  assertEquals(d.length, 1);
  const diag = d[0];
  assertExists(diag);
  assertEquals(diag.id, "no-type-assertion/no-type-assertion");
  assertEquals(
    diag.message,
    "Do not use any type assertions. Use a type annotation or `satisfies` operator instead.",
  );
});

Deno.test("reports angle-bracket type assertion", () => {
  const d = Deno.lint.runPlugin(
    plugin,
    "test.ts",
    `const x = <string>"hello";`,
  );
  assertEquals(d.length, 1);
  const diag = d[0];
  assertExists(diag);
  assertEquals(diag.id, "no-type-assertion/no-type-assertion");
});

Deno.test("allows `as const`", () => {
  const d = Deno.lint.runPlugin(
    plugin,
    "test.ts",
    `const x = "hello" as const;`,
  );
  assertEquals(d.length, 0);
});

Deno.test("allows `<const>`", () => {
  const d = Deno.lint.runPlugin(plugin, "test.ts", `const x = <const>"hello";`);
  assertEquals(d.length, 0);
});

Deno.test("allows type annotations", () => {
  const d = Deno.lint.runPlugin(
    plugin,
    "test.ts",
    `const x: string = "hello";`,
  );
  assertEquals(d.length, 0);
});

Deno.test("allows `satisfies`", () => {
  const d = Deno.lint.runPlugin(
    plugin,
    "test.ts",
    `const x = "hello" satisfies string;`,
  );
  assertEquals(d.length, 0);
});

Deno.test("reports nested `as` assertion", () => {
  const d = Deno.lint.runPlugin(
    plugin,
    "test.ts",
    `const x = (obj as any).foo;`,
  );
  assertEquals(d.length, 1);
});

Deno.test("reports double assertion (as unknown as T)", () => {
  const d = Deno.lint.runPlugin(
    plugin,
    "test.ts",
    `const x = value as unknown as string;`,
  );
  assertEquals(d.length, 2);
});

Deno.test("reports generic angle-bracket assertion", () => {
  const d = Deno.lint.runPlugin(
    plugin,
    "test.ts",
    `const x = <Array<string>>value;`,
  );
  assertEquals(d.length, 1);
});

Deno.test("allows `as const satisfies`", () => {
  const d = Deno.lint.runPlugin(
    plugin,
    "test.ts",
    `const x = { a: 1 } as const satisfies { a: number };`,
  );
  assertEquals(d.length, 0);
});
