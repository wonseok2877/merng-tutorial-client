import React, { useContext } from "react";
import { Button, Card, Icon, Image, Label } from "semantic-ui-react";
import moment from "moment";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth";
import LikeButton from "./LikeButton";
import DeleteButton from "./DeleteButton";
import ShitPopup from "../util/ShitPopup";
//
// props ? 설명 필요
/* 애초에 인자값으로 useQuery로 받은 post 각각의 애기들을  바로 렌더링에다 써먹는다.  */
const PostCard = ({
  post: { body, createdAt, id, username, likeCount, commentCount, likes },
}) => {
  const { user } = useContext(AuthContext);

  return (
    <Card fluid>
      <Card.Content>
        <Image
          floated="right"
          size="mini"
          src="https://react.semantic-ui.com/images/avatar/large/molly.png"
        />
        <Card.Header>{username}</Card.Header>
        {/* moment : new Date().toISOString() 포맷을 다시 바꿔줌.
        .fromNow() : 현재 시간으로부터 몇시간 전인지 계산 */}
        <Card.Meta as={Link} to={`/posts/${id}`}>
          {moment(createdAt).fromNow(true)}
        </Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <LikeButton user={user} post={{ id, likes, likeCount }} />
        {/* Popup ! : 팝업 띄워주는 semantic ui 기능. 감싸줘얗 함. */}
        <ShitPopup content="Comment on post">
          <Button labelPosition="right" as={Link} to={`/posts/${id}`}>
            <Button color="purple" basic>
              <Icon name="comments" />
            </Button>
            <Label basic color="purple" pointing="left">
              {commentCount}
            </Label>
          </Button>
        </ShitPopup>
        {user && user.username === username && <DeleteButton postId={id} />}
      </Card.Content>
    </Card>
  );
};
export default PostCard;
