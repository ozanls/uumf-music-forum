// auth.js
// Middleware functions for authenticating and authorizing users.
const { Post } = require("../models");

// Check if the user is authenticated
function isAuthenticated(req, res, next) {
  // If the user is authenticated, continue
  if (req.isAuthenticated()) {
    return next();
  }

  // If the user is not authenticated, return 401
  res
    .status(401)
    .json({ message: "Unauthorized: Please log in and try again." });
}

// function banCheck(req, res, next) {
//   if (req.user.role === "banned") {
//     return res.status(403).json({ message: "Forbidden: You are banned." });
//   }

//   return next();
// }

function verifyAuthorization(model, resourceIdParam, permissions) {
  return async (req, res, next) => {
    const userRole = req.user?.role;

    // Check if the user is not logged in
    if (!req.user || req.user.id === null) {
      return res
        .status(403)
        .json({ message: "Unauthorized: Please log in and try again." });
    }

    const resourceId = req.params[resourceIdParam];

    // If the user has one of the required roles, allow access
    if (permissions.includes(userRole)) {
      return next();
    }

    try {
      // Fetch the resource from the database
      const resource = await model.findByPk(resourceId);

      // If the resource does not exist, return 404
      if (!resource) {
        return res.status(404).json({ message: "Resource not found." });
      }

      // If the resource's author matches the user's ID, allow access
      if (resource.userId === req.user.id) {
        return next();
      }

      // If none of the above conditions are met, deny access
      res.status(403).json({
        message: "Forbidden: You do not have access to this resource.",
      });
    } catch (error) {
      console.error("Error verifying authorization:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  };
}

function verifyAdmin() {
  return async (req, res, next) => {
    const userRole = req.user?.role;

    // Check if the user is not logged in
    if (!req.user || req.user.id === null) {
      return res
        .status(403)
        .json({ message: "Unauthorized: Please log in and try again." });
    }

    // If the user has the admin role, allow access
    if (userRole === "admin") {
      return next();
    }

    // If the user does not have the admin role, deny access
    res
      .status(403)
      .json({ message: "Forbidden: You do not have access to this resource." });
  };
}

module.exports = {
  isAuthenticated,
  verifyAuthorization,
  verifyAdmin,
};
