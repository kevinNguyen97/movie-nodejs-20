const logger = (req, _, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
};

module.exports = {
  logger,
};
