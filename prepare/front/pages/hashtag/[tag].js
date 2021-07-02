import React, { useEffect } from "react"; //Next.js does not require it actually
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { END } from "redux-saga";
import axios from "axios";

import PostCard from "../../components/PostCard";
import Applayout from "../../components/Applayout";

import { LOAD_HASHTAG_POSTS_REQUEST } from "../../reducers/post";
import { LOAD_MY_INFO_REQUEST, LOAD_USER_REQUEST } from "../../reducers/user";

import wrapper from "../../store/configureStore";

const Hashtag = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { tag } = router.query;
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
            type: LOAD_HASHTAG_POSTS_REQUEST,
            data: tag,
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
  }, [mainPosts, hasMorePost, tag, loadPostsLoading]);

  return (
    <Applayout>
      <h2>Posts including #{tag}</h2>

      {mainPosts.map((c) => (
        <PostCard key={c.id} post={c} />
      ))}
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
      type: LOAD_MY_INFO_REQUEST,
    });
    context.store.dispatch({
      type: LOAD_HASHTAG_POSTS_REQUEST,

      data: context.params.tag,
    });
    context.store.dispatch(END);
    await context.store.sagaTask.toPromise(); //sagaTask from configStore
  }
); //SSR,ran before the line below

export default Hashtag;
