import { useState } from "react";

export const useForm = (callback, initialState = {}) => {
  const [values, setValues] = useState(initialState);

  const onChange = (event) => {
    /*지금까지의 state에다가 overwrite한다.
  event.target.name은 각각의 form input에서 정의한 것들.
   그 array에다가 .target.value를 저장한다.
   설명 필요 
   */
    /* ! : 결국 각각의 애기들한테 value를 할당하는 거임.
  근데 username이라고 하면 바로 mike가 되는게 아니라,
  username : "mike" 식으로.
  ? : 근데 array로 감싸주는 이유는 머지?
  설명 필요*/
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    /* ? : state에 input값들이 차곡차곡 들어가는 것까진 이해했어.
    근데 addUser, useMutation이 뭔데 바로 graphQL통해서 data를 집어넣는거야?
    설명 필요
     */
    /* callback function : ?
        we don't depending on what page the user will use,
        so the function should be different. */
    callback();
  };

  return {
    onChange,
    onSubmit,
    values,
  };
};
