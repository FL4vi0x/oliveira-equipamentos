export function sanitizePayload(payload: any): any {
  if (!payload) return null;

  const sensitiveKeys = [
    'senha',
    'password',
    'token',
    'refreshToken',
    'access_token',
    'refresh_token',
  ];
  const maxPayloadSize = 10000; // Limit payload to roughly 10kb of stringified JSON to prevent DB bloat

  const sanitizeRecursive = (obj: any, depth = 0): any => {
    if (depth > 5) return '[Max Depth Reached]'; // Prevent circular references or overly deep structures
    if (obj === null || typeof obj !== 'object') return obj;

    if (Array.isArray(obj)) {
      return obj.map((item) => sanitizeRecursive(item, depth + 1));
    }

    const sanitized: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (
          sensitiveKeys.some((sensitive) =>
            key.toLowerCase().includes(sensitive.toLowerCase()),
          )
        ) {
          sanitized[key] = '[FILTERED]';
        } else {
          sanitized[key] = sanitizeRecursive(obj[key], depth + 1);
        }
      }
    }
    return sanitized;
  };

  const sanitizedPayload = sanitizeRecursive(payload);

  // Truncate if too large
  const stringified = JSON.stringify(sanitizedPayload);
  if (stringified.length > maxPayloadSize) {
    return {
      _truncated: true,
      _originalSize: stringified.length,
      data: stringified.substring(0, maxPayloadSize) + '... [TRUNCATED]',
    };
  }

  return sanitizedPayload;
}
