import React, { useEffect } from "react"; //Next.js does not require it actually
import { useSelector, useDispatch } from "react-redux";
import { END } from "redux-saga";
import axios from "axios";

import Applayout from "../components/Applayout";
import PostForm from "../components/PostForm";
import PostCard from "../components/PostCard";

import { LOAD_POSTS_REQUEST } from "../reducers/post";
import { LOAD_MY_INFO_REQUEST } from "../reducers/user";

import wrapper from "../store/configureStore";

const Home = () => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const { mainPosts, hasMorePost, loadPostsLoading, retweetError } = useSelector(
    (state) => state.post
  );
  useEffect(() => {
    if (retweetError) {
      alert(retweetError);
    }
  }, [retweetError]);

  // Moved to SSR part (see below)
  // useEffect(() => {
  //   dispatch({
  //     type: LOAD_MY_INFO_REQUEST,
  //   });
  //   dispatch({
  //     type: LOAD_POSTS_REQUEST,
  //   });
  // }, []);

  useEffect(() => {
    function onScroll() {
      //많이 쓰는 세 가지
      // scrollY: 얼마나 내렸는 지
      // clientHeight: 화면 보이는 길이
      // scrollHeight: 총 길이
      // 따라서 끝까지 내렸을 때
      // scrollY + clientHeight=scrollHeight!!
      //   console.log(
      //     window.scrollY,
      //     document.documentElement.clientHeight,
      //     document.documentElement.scrollHeight
      //   );
      if (
        window.scrollY + document.documentElement.clientHeight >
        document.documentElement.scrollHeight - 300
      ) {
        if (hasMorePost && !loadPostsLoading) {
          const lastId = mainPosts[mainPosts.length - 1]?.id;
          dispatch({
            type: LOAD_POSTS_REQUEST,
            lastId,
          });
        }
      }
    }
    window.addEventListener("scroll", onScroll);
    //useEffect에서 window함수 쓸 때 중요한 건
    //이렇게 해제해주는 것
    //메모리 누수 방지
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [hasMorePost, loadPostsLoading]);

  return (
    <Applayout>
      {/* 로그인 시에만 보임 */}
      {me && <PostForm />}
      {mainPosts.map((post) => (
        <PostCard key={post.id} post={post} />
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
      type: LOAD_POSTS_REQUEST,
    });
    context.store.dispatch(END);
    await context.store.sagaTask.toPromise(); //sagaTask from configStore
  }
); //SSR,ran before the line below

export default Home;
