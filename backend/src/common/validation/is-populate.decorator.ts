import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import {
  registerDecorator,
  type ValidationArguments,
  type ValidationOptions,
} from 'class-validator';

function isPopulateArray(
  value: unknown,
  allowed: ReadonlySet<string>,
): value is string[] {
  if (!Array.isArray(value)) {
    return false;
  }

  if (value.length === 0) {
    return false;
  }

  const seen = new Set<string>();

  for (const item of value) {
    if (typeof item !== 'string' || !allowed.has(item) || seen.has(item)) {
      return false;
    }
    seen.add(item);
  }

  return true;
}

export function IsPopulate(
  allowed: readonly string[],
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  const allowedSet = new Set(allowed);

  return applyDecorators(
    Transform(({ value }: { value: unknown }): unknown => {
      if (value === undefined || value === null || value === '') {
        return undefined;
      }
      if (typeof value !== 'string') {
        return value;
      }
      return value.split(',');
    }),
    (target: object, propertyName: string | symbol): void => {
      registerDecorator({
        name: 'isPopulate',
        target: target.constructor,
        propertyName: propertyName.toString(),
        constraints: [allowed],
        options: {
          message:
            validationOptions?.message ??
            `each populate value must be one of: ${allowed.join(', ')}`,
          ...validationOptions,
        },
        validator: {
          validate(value: unknown, _args: ValidationArguments): boolean {
            if (value === undefined) {
              return true;
            }
            return isPopulateArray(value, allowedSet);
          },
        },
      });
    },
  );
}
