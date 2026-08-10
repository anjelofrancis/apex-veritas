const { ZodError } = require('zod');

/**
 * Validates `req.body` against a zod schema and replaces it with the parsed
 * result, so downstream handlers only ever see coerced, known-good fields.
 *
 * Usage: router.post('/', requireAuth, validateBody(createTaskSchema), crud.create)
 */
function validateBody(schema) {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body ?? {});
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          error: 'Validation failed',
          details: err.errors.map((e) => ({
            field: e.path.join('.') || '(body)',
            message: e.message,
          })),
        });
      }
      next(err);
    }
  };
}

module.exports = { validateBody };
