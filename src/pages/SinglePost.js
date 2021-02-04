import React, { useContext, useRef, useState } from "react";
import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/client";
import {
  Button,
  Card,
  Form,
  Grid,
  Icon,
  Image,
  Label,
} from "semantic-ui-react";
import moment from "moment";
import { AuthContext } from "../context/auth";
import LikeButton from "../components/LikeButton";
import DeleteButton from "../components/DeleteButton";
import ShitPopup from "../util/ShitPopup";

// props ?
function SinglePost(props) {
  console.log(props.match.params);
  // match ? params?
  const postId = props.match.params.postId;

  const { user } = useContext(AuthContext);
  console.log(user);

  /* useRef ??
  설명 필요 */
  const commentInputRef = useRef(null);

  // comment state variable
  const [comment, setComment] = useState("");

  /* useQuery aaa
variables ?
설명 필요 */
  /* 개같은 오류 자꾸 뜨네 . 해결해야함 */
  const {
    data: { getPost },
  } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postId,
    },
  });

  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    update() {
      setComment("");
      // .blur() : 인풋의 포커스를 지워줌?
      commentInputRef.current.blur();
    },
    variables: {
      postId,
      body: comment,
    },
  });

  function DeletePostCallback() {
    props.history.push("/");
  }

  // let ?
  /* logic : 
postId에 따라 post가 달라질 거기 때문에 이렇게 하는건가 ?ㅋ
설명 필요 */
  let postMarkup;

  // conditional
  if (!getPost) {
    postMarkup = <p>Loading post..</p>;
  } else {
    /* bring them from getPost .*/
    const {
      id,
      body,
      createdAt,
      username,
      comments,
      likes,
      likeCount,
      commentCount,
    } = getPost;

    console.log(getPost.comments);

    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image
              src="https://react.semantic-ui.com/images/avatar/large/molly.png"
              size="small"
              float="right"
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <hr />
              <Card.Content extra>
                <LikeButton user={user} post={{ id, likeCount, likes }} />
                <ShitPopup content="Comment on post">
                  <Button
                    as="div"
                    labelPosition="right"
                    onClick={() => console.log("Comment on post")}
                  >
                    <Button basic color="green">
                      <Icon name="comments" />
                    </Button>
                    <Label basic color="blue" pointing="left">
                      {commentCount}
                    </Label>
                  </Button>
                </ShitPopup>
                {user && user.username === username && (
                  <DeleteButton postId={id} callback={DeletePostCallback} />
                )}
              </Card.Content>
            </Card>
            {/* 로그인된 경우에만 코멘트를 쓸 수 있도록. */}
            {user && (
              <Card fluid>
                <Card.Content>
                  <p>Post a comment ~</p>
                  <Form>
                    <div className="ui action input fluid">
                      {/* input !
                      value : state
                      onChange : setState
                      ref : submit후에 인풋에 대한 포커스에서 벗어나기 위함. */}
                      <input
                        type="text"
                        placeholder="Comment.."
                        name="comment"
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                        ref={commentInputRef}
                      />
                      <button
                        type="submit"
                        className="ui button teal"
                        disabled={comment.trim() === ""}
                        onClick={submitComment}
                      >
                        Submit
                      </button>
                    </div>
                  </Form>
                </Card.Content>
              </Card>
            )}
            {comments.map((c) => (
              <Card fluid key={c.id}>
                <Card.Content>
                  {/* user가 존재하고 username과 comment의 username이 일치해야 실행
                  삭제 버튼에다 postId, commentId값을 보내준다. */}
                  {user && user.username === c.username && (
                    <DeleteButton postId={id} commentId={c.id} />
                  )}
                  <Card.Header>{c.username}</Card.Header>
                  <Card.Meta>{moment(c.createdAt).fromNow()}</Card.Meta>
                  <Card.Description>{c.body}</Card.Description>
                </Card.Content>
              </Card>
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  return postMarkup;
}

const FETCH_POST_QUERY = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

const SUBMIT_COMMENT_MUTATION = gql`
  mutation($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id
        body
        createdAt
        username
      }
      commentCount
    }
  }
`;

export default SinglePost;
