import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';

export const signToken = (id) => {
  return jwt.sign({ id }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

export const signRefreshToken = (id) => {
  return jwt.sign({ id }, config.jwt.secret, {
    expiresIn: '7d', // refresh token expires in 7 days
  });
};

export const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const refreshToken = signRefreshToken(user._id);

  const cookieOptions = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days for access token
    httpOnly: true,
  };
  
  if (config.env === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);
  res.cookie('refreshToken', refreshToken, { 
    ...cookieOptions, 
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) 
  });

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    refreshToken,
    data: {
      user,
    },
  });
};
