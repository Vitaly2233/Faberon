import { Transform } from 'class-transformer';

interface NormalizeTextOptions {
  emptyToNull?: boolean;
  lowercase?: boolean;
}

export function NormalizeText(
  options: NormalizeTextOptions = {},
): PropertyDecorator {
  return Transform(({ value }: { value: unknown }): unknown => {
    if (typeof value !== 'string') return value;

    let normalized = value.trim().replace(/\s+/g, ' ');
    if (options.lowercase) normalized = normalized.toLowerCase();
    if (options.emptyToNull && normalized === '') return null;
    return normalized;
  });
}
