import React, { useContext } from "react";
import { useQuery } from "@apollo/client";
/* ? : 백엔드에선 아폴로 서버의 gql을 썼다.
그런데 프론트에선 graphql의 gql? 이건 무슨 의미고 무슨 차이지?
설명 필요 */
import { Grid, Transition } from "semantic-ui-react";
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";

import { AuthContext } from "../context/auth";
import { FETCH_POSTS_QUERY } from "../util/graphql";

const Home = () => {
  const { user } = useContext(AuthContext);

  /* useQuery ?? : state처럼 우리 데이터를 어딘가에 담는건가?
  설명 필요
   */
  const { loading, error, data } = useQuery(FETCH_POSTS_QUERY);
  // console.log(useQuery(FETCH_POSTS_QUERY).data);

  if (error) return `Error! ${error.message}`;

  return (
    <Grid columns={3}>
      <Grid.Row className="page-title">
        <h1>Recent Posts</h1>
      </Grid.Row>
      <Grid.Row>
        {user && (
          <Grid.Column>
            <PostForm />
          </Grid.Column>
        )}
        {loading ? (
          <h1>Loading posts...</h1>
        ) : (
          <Transition.Group>
            {data.getPosts &&
              data.getPosts.map((p) => (
                <Grid.Column key={p.id} style={{ marginBottom: 20 }}>
                  <PostCard post={p} />
                </Grid.Column>
              ))}
          </Transition.Group>
        )}
      </Grid.Row>
    </Grid>
  );
};

export default Home;
