import React, { useEffect } from "react"; //Next.js does not require it actually
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { END } from "redux-saga";
import Head from "next/head";
import axios from "axios";

import PostCard from "../../components/PostCard";
import Applayout from "../../components/Applayout";

import { Card, Avatar } from "antd";

import { LOAD_USER_POSTS_REQUEST } from "../../reducers/post";
import { LOAD_MY_INFO_REQUEST, LOAD_USER_REQUEST } from "../../reducers/user";

import wrapper from "../../store/configureStore";

const User = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = router.query;
  const { userInfo,me } = useSelector((state) => state.user);
  const { mainPosts, hasMorePost, loadPostsLoading } = useSelector(
    (state) => state.post
  );

  useEffect(() => {
    function onScroll() {
      if (
        window.scrollY + document.documentElement.clientHeight >
        document.documentElement.scrollHeight - 300
      ) {
        if (hasMorePost && !loadPostsLoading) {
          dispatch({
            type: LOAD_USER_POSTS_REQUEST,
            data: id,
            lastId:
              mainPosts[mainPosts.length - 1] &&
              mainPosts[mainPosts.length - 1].id,
          });
        }
      }
    }
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [mainPosts, hasMorePost, id,loadPostsLoading]);

  return (
    <Applayout>
      {userInfo &&(userInfo.id !== me?.id) ? (
        <>
          <Head>
            <title> {userInfo.nickname}'s Posts</title>

            <meta name="description" content={`${userInfo.nickname}'s Posts`} />
            <meta
              property="og:title"
              content={`${userInfo.nickname}'s Posts`}
            />
            <meta
              property="og:description"
              content={`${userInfo.nickname}'s Posts`}
            />
            <meta
              property="og:image"
              content={"https://wesoodaa.com/favicon.ico"}
            />
            <meta
              property="og:url"
              content={`https://wesoodaa.com/user/${id}`}
            />
          </Head>

          <Card
            style = {{marginBottom: 20}}
            actions={[
              <div key="twit">
                Tweets
                <br />
                {userInfo.Posts}
              </div>,
              <div key="following">
                Followings
                <br />
                {userInfo.Followings}
              </div>,
              <div key="follower">
                Followers
                <br />
                {userInfo.Followers}
              </div>,
            ]}
          >
            <Card.Meta
              avatar={<Avatar>{userInfo.nickname[0]}</Avatar>}
              title={userInfo.nickname}
            />
          </Card>

          {mainPosts.map((c) => (
            <PostCard key={c.id} post={c} />
          ))}
        </>
      ) : (
        <div>No user found.</div>
      )}
    </Applayout>
  );
};


export const getServerSideProps = wrapper.getServerSideProps(
  async (context) => {
    const cookie = context.req ? context.req.headers.cookie : "";
    axios.defaults.headers.Cookie = "";
    if (context.req && cookie) {
      axios.defaults.headers.Cookie = cookie;
    }
    context.store.dispatch({
      type: LOAD_USER_POSTS_REQUEST,
      data: context.params.id,
    });

    context.store.dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });
    context.store.dispatch({
      type: LOAD_USER_REQUEST,

      data: context.params.id,
    });
    context.store.dispatch(END);
    await context.store.sagaTask.toPromise(); //sagaTask from configStore
  }
); //SSR,ran before the line below

export default User;
