const jwt = require('jsonwebtoken');

exports.signAccessToken = (user) => {
  return jwt.sign({ sub: user._id, role: user.role }, process.env.ACCESS_TOKEN_SECRET || 'technoaccess', { expiresIn: '15m' });
};

exports.signRefreshToken = (user) => {
  return jwt.sign({ sub: user._id }, process.env.REFRESH_TOKEN_SECRET || 'technorefresh', { expiresIn: '7d' });
};
