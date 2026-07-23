type UnauthorizedHandler = () => void | Promise<void>;

let unauthorizedHandler: UnauthorizedHandler | null = null;

export function registerUnauthorizedHandler(handler: UnauthorizedHandler): void {
  unauthorizedHandler = handler;
}

export async function notifyUnauthorized(): Promise<void> {
  if (unauthorizedHandler) {
    await unauthorizedHandler();
  }
}
