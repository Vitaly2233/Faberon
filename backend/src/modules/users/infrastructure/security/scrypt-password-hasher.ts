import { Injectable } from '@nestjs/common';
import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';

const algorithm = 'scrypt';
const keyLength = 64;

function deriveKey(
  password: string,
  salt: Buffer,
  keyLength: number,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, keyLength, (error, derivedKey) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(derivedKey);
    });
  });
}

@Injectable()
export class ScryptPasswordHasher {
  async hash(password: string): Promise<string> {
    const salt = randomBytes(16);
    const key = await deriveKey(password, salt, keyLength);
    return `${algorithm}$${salt.toString('base64url')}$${key.toString('base64url')}`;
  }

  async verify(password: string, encodedHash: string): Promise<boolean> {
    const [storedAlgorithm, encodedSalt, encodedKey, extra] =
      encodedHash.split('$');
    if (
      storedAlgorithm !== algorithm ||
      encodedSalt === undefined ||
      encodedKey === undefined ||
      extra !== undefined
    ) {
      return false;
    }

    try {
      const salt = Buffer.from(encodedSalt, 'base64url');
      const expectedKey = Buffer.from(encodedKey, 'base64url');
      if (salt.length === 0 || expectedKey.length === 0) return false;

      const actualKey = await deriveKey(password, salt, expectedKey.length);
      return timingSafeEqual(actualKey, expectedKey);
    } catch {
      return false;
    }
  }
}
