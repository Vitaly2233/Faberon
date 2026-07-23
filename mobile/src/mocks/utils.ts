export function delay(ms = 350): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function clone<T>(value: T): T {
  return structuredClone(value);
}
