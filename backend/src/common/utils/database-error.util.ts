import { DatabaseError } from 'pg';

export function isUniqueViolation(error: unknown): boolean {
  const cause = error instanceof Error ? error.cause : undefined;
  return cause instanceof DatabaseError && cause.code === '23505';
}
