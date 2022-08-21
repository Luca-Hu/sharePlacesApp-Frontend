import { useState, useCallback, useEffect} from 'react';

let logoutTimer; // 这个timer不是page应该render 的内容，所以放在APP 外面
// set a timer : make sure to lock the user out when token expires（定时器：用于在token 过期后强迫user logout）

export const useAuth = () => {
  const [token, setToken] = useState(false); // token 代替了 isLoggedIn 的state
  const [tokenExpiration_LogoutDate, setTokenExpiration_LogoutDate] = useState();
  const [userId, setUserId] = useState(false);

  const login = useCallback((uid, token, expirationDate) => {  // 登录后更新 uid 和 token, token 储存在Browser的local storage中。expirationDate是auto-login时会传入的值。
    setToken(token);
    setUserId(uid); 
    const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60); // 预计的过期时间
    // 如果是auto-login, expirationDate不为空，执行 ||前语句。 如果是form-login, expirationDate为空，执行|| 后的语句：产生新的timeStamp 
    setTokenExpiration_LogoutDate(tokenExpirationDate);
    localStorage.setItem( 
      'userData',
      JSON.stringify({ // 注意，存储的data格式还是JSON.string，对象将失去原来的object意义，变成“描述对象”的string
        userId: uid, 
        token: token, 
        expiration: tokenExpirationDate.toISOString()
        // toISOString(): 这是一种专用于储存日期的String格式，它能确保将 date-> ISOstring，以及在之后的 ISOstring-> date 的过程中不会丢失数据。
      })
    );    
  }, []); // useCallback 函数：只运行一次

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    setTokenExpiration_LogoutDate(null); // 如果不重置为null，会导致立即auto-logout
    localStorage.removeItem('userData'); // logout 之后清除 token
  }, []);

  useEffect(() => {
    if(token && tokenExpiration_LogoutDate) {
      const remainingTime = tokenExpiration_LogoutDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime); // 将计时器设置为remainingTime
    } else{ //如果没有token 或者 token到期时间
      clearTimeout(); // 清除所有的计时器timer。（例如手动logout后，会触发logout函数-setToken(null),此时我们就需要清除timer）
    }
  }, [token, logout, tokenExpiration_LogoutDate]); // 除了第一次render，只要token或者tokenExpiration_LogoutDate更新了，或者logout函数被触发了，那么就会再次触发该函数

  useEffect(() => { // 打开浏览器页面时，这个useEffect函数都会检查local storage 中是否存在 token
    const storedData = JSON.parse(localStorage.getItem('userData')) ; 
    // JSON.parse：把JSON string 解析回js数据结构（例如js对象）  JSON.stringfy ： 把js数据结构（比如js对象）转化为JSON string . 
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date() // new Date(): 现在的时间， new Date(storedData.expiration): ISO string -> 时间
      ){ 
      login(storedData.userId, storedData.token, new Date(storedData.expiration)); // auto-login!
      // 使用Browser 的local Storage 中的 userId 和 token 自动login！
    }
  }, [login]); // React 会加载好所有的默认组件，再来run一次useEffect(由于dependency 为空数组，所以useEffect只run一次)

  return { userId, token, login, logout };
};