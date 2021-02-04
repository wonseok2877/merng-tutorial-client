import React, { useContext, useState } from "react";
import { Button, Form } from "semantic-ui-react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import { useForm } from "../util/hooks";
import { AuthContext } from "../context/auth";

const Register = (props) => {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  const { onChange, onSubmit, values } = useForm(registerUser, {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  /* useMutation ? : 설명 필요
  now we need client side validation. and Mutation of graphQL. */
  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    /* update() : 
  this will be triggered when the mutation is successfully executed. */
    update(_, { data: { register: userData } }) {
      console.log(userData);
      /* 왜 바로 홈페이지로 안가지는거 ??
      설명 필요
       */
      context.login(userData);
      props.history.push("/");
    },
    /* onError() : 에러를 잡아서 보여준다. 
    설명 필요 
    */
    onError(err) {
      setErrors(
        err && err.graphQLErrors[0]
          ? err.graphQLErrors[0].extensions.exception.errors
          : {}
      );
    },
    /* this is mutation, so we need to give variables of mutation.
  state를 그대로 집어넣는다 !  
*/
    variables: values,
  });

  /* arrow function일때는 인식 안되는 registerUser가, 그냥 function일때는 인식이 된다.
  순서 다 좆까고 여기서 모이는 느낌
  function of javascript? hoisting ? 
  설명 필요
  */
  function registerUser() {
    addUser();
  }

  return (
    <div className="form-container">
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
        <h1>Register</h1>
        <Form.Input
          name="username"
          type="text"
          label="Username"
          placeholder="Username.."
          value={values.username}
          onChange={onChange}
        />
        <Form.Input
          name="email"
          type="email"
          label="Email"
          placeholder="Email.."
          value={values.email}
          onChange={onChange}
          error={errors.email ? true : false}
        />
        <Form.Input
          name="password"
          type="password"
          label="Password"
          placeholder="Password.."
          value={values.password}
          onChange={onChange}
          error={errors.password ? true : false}
        />
        <Form.Input
          name="confirmPassword"
          type="password"
          label="Confirm Password"
          placeholder="Confirm Password.."
          value={values.confirmPassword}
          onChange={onChange}
          error={errors.confirmPassword ? true : false}
        />
        <Button type="submit" primary>
          Register
        </Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {/* Object : errors state가 object형태기 때문임.
          values : 그 안의 내용물
          .map : 
           */}
            {Object.values(errors).map((v) => (
              <li key={v}>{v}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    # triggers register mutation.
    register(
      # 서버에서 정의한 이름.
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      # after trigger, let's get the fields back.
      id
      email
      username
      createdAt
      token
    }
  }
`;

export default Register;
