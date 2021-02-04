import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Icon, Label } from "semantic-ui-react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";

/* 다른 component와의 연결!
PostCard에서 거의 모든 정보를 받아서 쓰는거다 지금. liked라는 state를 따로 굴리고 있기는 하지만.
그렇게 받은 정보를, useMutation에다가 넣기만 하면 이 버튼의 역할은 끝난다.
logic : 버튼이 눌릴 때마다, 즉 이 component 함수가 실행될 때마다
useEffect함수 실행 ->  조건문 -> like과 user의 username이 같아야만 state에다 true값 넣음
-> true라면 빨간 배경색의 버튼을 return하고, false라면 빈 버튼을 return.
user값 자체가 없다면, 로그인 페이지로 이동. */

function LikeButton({ user, post: { id, likes, likeCount } }) {
  // useState
  const [liked, setLiked] = useState(false);

  //   useMutation
  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    variables: { postId: id },
  });

  // if (likes.length !== 0) {
  //   likes.find((like) => console.log(like.username));
  //   console.log(user);
  //   console.log(user.username);
  //   console.log(likes);
  // }

  // useEffect ?
  useEffect(() => {
    if (user && likes.find((like) => like.username === user.username)) {
      setLiked(true);
    } else setLiked(false);
    // whenever these two changes, it will recalculate the value
  }, [user, likes]);

  const likeBuuutton = user ? (
    liked ? (
      <Button color="red">
        <Icon name="heart" />
      </Button>
    ) : (
      <Button color="red" basic>
        <Icon name="heart" />
      </Button>
    )
  ) : (
    /* logic : 
      로그인이 안 된 상태에서 누를 때 로그인 페이지로 가도록.
       */
    <Button as={Link} to="/login" color="red" basic>
      <Icon name="heart" />
    </Button>
  );

  return (
    <Button as="div" labelPosition="right" onClick={likePost}>
      {likeBuuutton}
      <Label basic color="red" pointing="left">
        {likeCount}
      </Label>
    </Button>
  );
}

const LIKE_POST_MUTATION = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likes {
        id
        username
      }
      likeCount
    }
  }
`;

export default LikeButton;
