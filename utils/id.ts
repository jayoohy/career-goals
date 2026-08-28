/** Generates a locally-unique id for rows created at runtime (quiz attempts, user-added roadmap items). Never exposed as an editable field — see rules/slug-rule.md. */
export function generateId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
