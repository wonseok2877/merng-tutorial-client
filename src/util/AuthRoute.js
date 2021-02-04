// 로그인 되어있을 때 등록 혹은 다시 로그인을 못하도록.
import React, { useContext } from "react";
import { Redirect, Route } from "react-router-dom";
import { AuthContext } from "../context/auth";

function AuthRoute({ component: Component, ...rest }) {
  const { user } = useContext(AuthContext);
  return (
    <Route
      /**
     ... : ? 설명 필요
     */
      {...rest}
      render={(props) =>
        /* conditional
        : 유저가 참일 경우 홈페이지로, 
        null일 경우 해당 component로 들어갈 수 있도록.
        설명 필요*/
        user ? <Redirect to="/" /> : <Component {...props} />
      }
    />
  );
}

export default AuthRoute;
