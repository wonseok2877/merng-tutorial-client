import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Menu } from "semantic-ui-react";
import { AuthContext } from "../context/auth";

const MenuBar = () => {
  const { user, loggingout } = useContext(AuthContext);

  /* window.location : 현재 url주소를 인식할 수 있다.
  ? : req의 url이랑은 뭐가 다른거지?
  리액트 쪽에서는 req에 접근할 수 없나? 컨트롤러 함수가 아니니까?  */
  const pathname = window.location.pathname;
  //  substring() :  pathname이 /를 포함하고 있어서 텍스트만 하나하나 건져내는 중..살짝 미개.
  const path = pathname === "/" ? "home" : pathname.substring(1);
  /* ! : state의 활용
    현재 state를 react에서 굴릴 수 있다는 걸 응용해서 페이지상의 하이라이트 효과를
    자동으로 주고 있다. 지금은 home버튼에 디폴트로. */
  const [activeItem, setActiveItem] = useState(path);

  // 클릭 이벤트 함수 : state로 그 이름을 넣는다.
  const handleItemClick = (e, { name }) => setActiveItem(name);

  const menuuuuBar = user ? (
    <Menu pointing secondary size="massive" color="yellow">
      <Menu.Item name={user.username} active as={Link} to="/" />
      <Menu.Menu position="right">
        <Menu.Item
          name="logout"
          // trigger context API function
          onClick={loggingout}
        />
      </Menu.Menu>
    </Menu>
  ) : (
    <Menu pointing secondary size="massive" color="yellow">
      <Menu.Item
        name="home"
        // active : state가 일치할 경우, 사용자가 현 페이지에서 액티브하다는 느낌을 준다.
        active={activeItem === "home"}
        onClick={handleItemClick}
        as={Link}
        to="/"
      />
      <Menu.Menu position="right">
        <Menu.Item
          name="login"
          active={activeItem === "login"}
          onClick={handleItemClick}
          /*  Link of React Router DOM !
           this menu bars can act as a link of another component */
          as={Link}
          to="/login"
        />
        <Menu.Item
          name="register"
          active={activeItem === "register"}
          onClick={handleItemClick}
          as={Link}
          to="/register"
        />
      </Menu.Menu>
    </Menu>
  );

  return menuuuuBar;
};

export default MenuBar;
