function wrapHandler(handler) {
  return (req, res, next) => {
    try {
      const result = handler(req, res, next);
      if (result && typeof result.catch === 'function') {
        result.catch(next);
      }
    } catch (err) {
      next(err);
    }
  };
}

module.exports = { wrapHandler };
