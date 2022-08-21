import React from 'react';
import {
  BrowserRouter as Router, // 重命名为Router
  Route,
  Redirect,
  Switch
} from 'react-router-dom';

import Users from './user/pages/Users';
import NewPlace from './places/pages/NewPlace';
import UserPlaces from './places/pages/UserPlaces';
import UpdatePlace from './places/pages/UpdatePlace';
import Auth from './user/pages/Auth';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/hooks/auth-hook';

const App = () => {
  // manage states 就像是 check off 最后的校验环节
  const { userId , token , login, logout} = useAuth(); // destrcuture useAuth()

  let routes;

  if (token) { // token 代替 isLoggedIn： token 非空，即代表已经登录
    routes = (
      <Switch>
        {/* switch 保证了在已经找到一个能够识别route的path之后，就不再向后寻找，即只会进入一个route */}
        <Route path="/" exact> 
        {/* 不加exact的默认情况下，path只是规定了“触发route”的前缀，但如果加了exact，就规定“触发route”必须完全符合path */}
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/places/new" exact>
          <NewPlace />
        </Route>
        <Route path="/places/:placeId">
          <UpdatePlace />
        </Route>
        <Redirect to="/" />
        {/* 如果以上的route都没有触发，那么 redirect to home */}
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/auth">
          <Auth />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{ 
        isLoggedIn: !!token, // !!token ： is true if token is truthy. is false if token is faulty. 此处仅为判断用户是否登录的state
        token : token, // 储存具体的token，因为一会前端向后段发送req时，需要附加上这个token
        userId : userId,
        login: login,
        logout: logout }}
    >
      <Router>
        <MainNavigation />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
