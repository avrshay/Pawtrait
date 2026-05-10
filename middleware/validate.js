
function validateCreateUser(req, res, next) {
  const { firstName, lastName,userRole } = req.body
  if (!firstName ||!lastName|| typeof firstName !== "string"|| typeof lastName !== "string") {
    return res.status(400).json({ data: null, error: "Invalid name" })
  }
  if (!userRole|| typeof userRole !== "string"||!["user","manager", "admin"].includes(userRole)) {
    return res.status(400).json({ data: null, error: "Invalid userRole" })
  }
  next()
}

function validateRegister(req, res, next) {
  const { firstName, lastName,email,phone_number, password } = req.body
  if (!firstName ||!lastName|| typeof firstName !== "string"|| typeof lastName !== "string") {
    return res.status(400).json({ data: null, error: "Invalid name" })
  }
  if (!email||typeof email !== "string"||!email.includes("@")) {
    return res.status(400).json({
      error: "Invalid Email"
    });
  }
  if (!phone_number || typeof phone_number !== "string") {
    return res.status(400).json({
      error: "Invalid phone number"
    });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({
      error: "Password must be at least 6 characters"
    });
  }
  next()
}

module.exports = { validateCreateUser, validateRegister}