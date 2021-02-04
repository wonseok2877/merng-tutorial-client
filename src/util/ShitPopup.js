import React from "react";
import { Popup } from "semantic-ui-react";

/* element 나누기 !
특정 속성을 부여하고 그 안에다 약속된 인자값을 넣으면, 어디든지 공용으로 쓸 수 있다.
children은 자식 element를 말함.
inverted속성은 공통 적용됨. 개꿀.
설명 필요 */
function ShitPopup({ content, children }) {
  return <Popup inverted content={content} trigger={children} />;
}

export default ShitPopup;
