import { validator } from "hono/validator";
import { HTTPException } from "hono/http-exception";

export const idempotencyValidator = validator('header', (value, c) => {
  const idempotencyKey = value['idempotency-key'];

  if (
    typeof idempotencyKey === 'undefined'
    || idempotencyKey === ''
  ) {
    throw new HTTPException(400, {
      message: 'Idempotency-Key is required.',
    });
  }
  return {
    idempotencyKey,
  };
});
