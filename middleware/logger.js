function logger(req, res, next) {

  const start_request = Date.now();
  res.on("finish", () => {

    const duration = Date.now() - start_request;

    console.log(`${req.method} ${req.originalUrl} | ${res.statusCode} | ${new Date().toISOString()} | ${duration}ms`);
  });

  next();
}
module.exports = logger;