const ApiError = require('../utils/ApiError');
const { verifyToken } = require('../utils/jwtUtils');

const protect = (req, res, next) => {
  let token;
  // Parse Bearer Token pattern
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ApiError(401, 'Unauthorized request - Token missing'));
  }

  try {
    // Inject decoded fields (like id, role) into req.user
    const decoded = verifyToken(token);
    req.user = decoded; 
    next();
  } catch (error) {
    return next(new ApiError(401, 'Unauthorized request - Invalid or expired token'));
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(403, `Forbidden - User role mapping restricts access`));
    }
    next();
  };
};

module.exports = { protect, authorize };
