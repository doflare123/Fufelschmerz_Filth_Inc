module.exports = function (role) {
  return function (req, res, next) {
    if (req.user.role !== role) return res.sendStatus(403);
    next();
  };
};