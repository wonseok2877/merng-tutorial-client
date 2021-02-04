import React, { useState } from "react";
import gql from "graphql-tag";
import { Button, Confirm, Icon } from "semantic-ui-react";
import { useMutation } from "@apollo/client";
import { FETCH_POSTS_QUERY } from "../util/graphql";
import ShitPopup from "../util/ShitPopup";

function DeleteButton({ postId, commentId, callback }) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  /* let's make mutation dynamic.
한 component에서 mutation을 2개 정의하고 사용하는 것. 
설명 필요 */
  /* commentId가 참일 경우는 코멘트 삭제버튼이고, 거짓일 경우엔 포스트삭제버튼.
이렇게 경우에 따라 mutation 실행을 달리하는것. */
  const choiceMutation = commentId
    ? DELETE_COMMENT_MUTATION
    : DELETE_POST_MUTATION;

  const [deletePostOrComment] = useMutation(choiceMutation, {
    // 삭제하기 전에 확인 모달창
    // 삭제한 뒤엔 모달창을 닫아준다.
    /* update() ??
      설명 필요 */
    update(proxy) {
      setConfirmOpen(false);
      if (!commentId) {
        // callback function ? trigger funcrion ?
        const data = proxy.readQuery({
          query: FETCH_POSTS_QUERY,
        });
        data.getPosts = data.getPosts.filter((p) => p.id !== postId);
        proxy.writeQuery({ query: FETCH_POSTS_QUERY, data });
      }
      if (callback) callback();
    },
    variables: {
      // deletePost와 deleteComment 모두에 필요함.
      postId,
      // deleteComment에만 필요. deletePost의 경우엔 무시됨.
      commentId,
    },
  });

  return (
    <>
      <ShitPopup content={commentId ? "Delete commentt" : "Delete post"}>
        <Button
          as="div"
          color="red"
          floated="right"
          onClick={() => setConfirmOpen(true)}
        >
          <Icon name="trash" style={{ margin: 0 }} />
        </Button>
      </ShitPopup>

      {/* Confirm :
      sematic ui에서 온 도구. confirmOpen state가 true일때만 open된다.
      onConfirm의 경우 deletePostOrComment, 즉 삭제 mutation 함수를 실행한다. */}
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deletePostOrComment}
      />
    </>
  );
}

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id
        username
        createdAt
        body
      }
      commentCount
    }
  }
`;

export default DeleteButton;
