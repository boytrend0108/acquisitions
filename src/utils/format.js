export const formatValidationErrors = errors => {
  if (!errors || !errors.issues) return 'Validation failed';

  if (Array.isArray(errors.issues)) {
    return errors.issues.map(i =>
      Array.isArray(i.message) ? i.message.join(', ') : String(i.message)
    );
  }

  return JSON.stringify(errors);
};
