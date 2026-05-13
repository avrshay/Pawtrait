function authorize(allowedRoles) {
//A function within a function to allow checking the current user role and allowing
//access only if this role is allowed for each requested action.
  return (req, res, next) => {

    const role = req.headers["x-user-role"];

    if (!role||!allowedRoles.includes(role)) {
      return res.status(403).json({
        success: false,
        data: null,
        error: {
          code: "FORBIDDEN",
          message: "You do not have permission to perform this action.",
          details: {}
        }
      });
    }
    next();
  };
}

function authorizeSelf(req, res, next) {
 //regular user may only access and update their own data.
  const role = req.headers["x-user-role"];
   if (["admin","manager"].includes(role)) {
        return next();
   }
  const userId = Number(req.headers["x-user-id"]);
  const targetId = Number(req.params.id);
  if (userId === targetId) {
        return next();
  }
  return res.status(403).json({
    success: false,
    data: null,
    error: {
      code: "FORBIDDEN",
      message: "You do not have permission to perform this action.",
      details: {}
    }
  });
}

/** Cart routes identify the owner via x-user-id (who the cart belongs to). */
function requireCartUserIdHeader(req, res, next) {
  const uid = Number(req.headers["x-user-id"]);
  if (!Number.isFinite(uid)) {
    return res.status(400).json({
      error: "x-user-id header is required (numeric cart owner)",
    });
  }
  next();
}


module.exports = { authorize, authorizeSelf, requireCartUserIdHeader };