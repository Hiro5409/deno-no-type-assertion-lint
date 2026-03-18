/**
 * Deno lint plugin that forbids TypeScript type assertions (`as` and angle-bracket).
 * `as const` / `<const>` is allowed.
 *
 * Inspired by `@typescript-eslint/consistent-type-assertions` (`assertionStyle: "never"`)
 * and `oxc/consistent-type-assertions` (error message), implemented as a native Deno lint plugin.
 *
 * @example
 * ```jsonc
 * // deno.json
 * {
 *   "lint": {
 *     "plugins": ["jsr:@hiro5409/deno-no-type-assertion-lint"]
 *   }
 * }
 * ```
 *
 * @module
 */

/** Whether a type annotation node is `const` (for `as const` / `<const>`). */
function isConst(
  ta: { type: string; typeName?: { type: string; name?: string } },
): boolean {
  return ta.type === "TSTypeReference" &&
    ta.typeName?.type === "Identifier" &&
    ta.typeName.name === "const";
}

const MESSAGE =
  "Do not use any type assertions. Use a type annotation or `satisfies` operator instead.";

/**
 * The lint plugin instance.
 *
 * Rules:
 * - `no-type-assertion/no-type-assertion` — Bans type assertions (`as const` / `<const>` allowed)
 */
const plugin: Deno.lint.Plugin = {
  name: "no-type-assertion",
  rules: {
    "no-type-assertion": {
      create(context) {
        return {
          TSAsExpression(node) {
            if (isConst(node.typeAnnotation)) return;
            context.report({ node, message: MESSAGE });
          },
          TSTypeAssertion(node) {
            if (isConst(node.typeAnnotation)) return;
            context.report({ node, message: MESSAGE });
          },
        };
      },
    },
  },
};

export default plugin;
