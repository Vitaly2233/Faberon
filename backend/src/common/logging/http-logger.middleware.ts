import { Logger } from '@nestjs/common';
import type { IncomingMessage, ServerResponse } from 'node:http';

type HttpRequest = IncomingMessage & { originalUrl?: string };
type HttpResponse = ServerResponse & {
  send: (body?: unknown) => HttpResponse;
};

const logger = new Logger('HTTP');
const maxLoggedBodyLength = 4_096;

function formatResponseBody(body: unknown): string {
  if (body === undefined) return '';

  let serialized: string;
  if (typeof body === 'string') {
    serialized = body;
  } else if (Buffer.isBuffer(body)) {
    serialized = body.toString('utf8');
  } else {
    try {
      serialized = JSON.stringify(body);
    } catch {
      serialized = String(body);
    }
  }

  const singleLine = serialized.replaceAll('\r', '\\r').replaceAll('\n', '\\n');
  const truncated =
    singleLine.length > maxLoggedBodyLength
      ? `${singleLine.slice(0, maxLoggedBodyLength)}…`
      : singleLine;

  return ` body=${truncated}`;
}

export function createHttpLoggerMiddleware(logResponseBodies: boolean) {
  return (request: HttpRequest, response: HttpResponse, next: () => void): void => {
    const method = request.method ?? 'UNKNOWN';
    const url = request.originalUrl ?? request.url ?? '/';
    const startedAt = process.hrtime.bigint();
    let responseBody: unknown;

    if (logResponseBodies) {
      const send = response.send.bind(response);
      response.send = (body?: unknown) => {
        responseBody = body;
        return send(body);
      };
    }

    logger.log(`--> ${method} ${url}`);

    response.once('finish', () => {
      const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
      const contentLength = response.getHeader('content-length');
      const size = contentLength === undefined ? '' : ` ${String(contentLength)} bytes`;
      const body = logResponseBodies ? formatResponseBody(responseBody) : '';

      logger.log(
        `<-- ${method} ${url} ${response.statusCode}${size} ${durationMs.toFixed(1)} ms${body}`,
      );
    });

    response.once('close', () => {
      if (!response.writableFinished) {
        logger.warn(`<-- ${method} ${url} connection closed before response completed`);
      }
    });

    next();
  };
}
