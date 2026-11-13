const jwt = require('jsonwebtoken');

const generateToken = (id, role = 'customer') => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'shopsphere_super_secret_jwt_key_2024_secure',
    {
      expiresIn: process.env.JWT_EXPIRE || '30d',
    }
  );
};

module.exports = generateToken;
