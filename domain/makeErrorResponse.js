module.exports = (res, code, message) => res.status(code).json({
  status: 'error',
  error: message,
});
