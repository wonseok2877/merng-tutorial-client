import React, { useContext, useState } from "react";
import { Button, Form } from "semantic-ui-react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import { useForm } from "../util/hooks";
import { AuthContext } from "../context/auth";

const Login = (props) => {
  // useContext !
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  const { onChange, onSubmit, values } = useForm(loginUser, {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // addUser is a function now
  const [checkUser, { loading }] = useMutation(LOGIN_USER, {
    // destructured result to data.login and named as userData
    update(_, { data: { login: userData } }) {
      console.log(userData);
      // Context API function
      context.loggingin(userData);
      props.history.push("/");
    },
    // 로그인이 성공적이어도 에러 잡길래 조건문 걸어둠..조잡하다.
    onError(err) {
      setErrors(
        err && err.graphQLErrors[0]
          ? err.graphQLErrors[0].extensions.exception.errors
          : {}
      );
    },

    variables: values,
  });

  function loginUser() {
    checkUser();
  }

  return (
    <div className="form-container">
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
        <h1>Login</h1>
        <Form.Input
          name="username"
          type="text"
          label="Username"
          placeholder="Username.."
          value={values.username}
          onChange={onChange}
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
        <Button type="submit" primary>
          Login
        </Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map((v) => (
              <li key={v}>{v}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

export default Login;
