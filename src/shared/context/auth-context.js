import { createContext } from 'react';

export const AuthContext = createContext({
  // 登录者信息
  isLoggedIn: false,
  userId: null,
  token: null,
  login: () => {},
  logout: () => {}
});
 