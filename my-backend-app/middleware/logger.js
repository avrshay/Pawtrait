function logger(req, res, next) {

  const start_request = Date.now();

  res.on("finish", () => {

    const duration = Date.now() - start_request;

    console.log(`[LOG] Method: ${req.method} | URL: ${req.originalUrl} | Status: ${res.statusCode} | Time: ${new Date().toISOString()} | Duration: ${duration}ms`);
  });

  next();
}
module.exports = logger;