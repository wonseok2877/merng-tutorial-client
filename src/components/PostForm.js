import gql from "graphql-tag";
import React from "react";
import { useMutation } from "@apollo/client";
import { useForm } from "../util/hooks";
import { Button, Form } from "semantic-ui-react";
import { FETCH_POSTS_QUERY } from "../util/graphql";

const PostForm = () => {
  const { values, onChange, onSubmit } = useForm(createPostCallBack, {
    body: "",
  });
  /* 두번 넣어야 리액트가 반응한다 ??
  state가 이전의 것에 머물러 있는건가
  그렇다고 해도 계속 이전의 것을 렌더링하는게 아니라, 두번 째엔 방금 넣은 것까지 렌더링한다.
   */

  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    update(proxy, result) {
      /* access to proxy object
      : we are gonna use graphQL query on existing client data
      instead of reaching to server. 
      it will fetch the posts from the client data that stored in the cache.
      now, all data in the cache will be stored in this data variable. */
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY,
      });
      // createPost는 mutation의 이름.지금까지의 getPost에다가 추가하겠다는 의미인듯
      data.getPosts = [result.data.createPost, ...data.getPosts];
      /* writeQuery ? : readQuery와 반대로 데이터를 보내겠다는건가? */
      proxy.writeQuery({ query: FETCH_POSTS_QUERY, data });
      values.body = "";
    },

    variables: values,
  });

  function createPostCallBack() {
    createPost();
  }

  return (
    <>
      <Form onSubmit={onSubmit}>
        <h2>Create a post</h2>
        <Form.Field>
          <Form.Input
            placeholder="Hi world!"
            name="body"
            onChange={onChange}
            value={values.body}
            error={error ? true : false}
          />
          <Button type="submit" color="teal">
            Submit
          </Button>
        </Form.Field>
      </Form>
      {error && (
        <div className="ui error message">
          <ul className="list">
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}
    </>
  );
};

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      username
      likes {
        id
        username
        createdAt
      }
      likeCount
      comments {
        id
        body
        username
        createdAt
      }
      commentCount
    }
  }
`;

export default PostForm;
