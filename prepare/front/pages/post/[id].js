//post/[id].js
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { LOAD_POST_REQUEST } from "../../reducers/post";
import { LOAD_MY_INFO_REQUEST } from "../../reducers/user";
import Applayout from "../../components/Applayout";
import PostCard from "../../components/PostCard";
import Head from "next/head";

import axios from "axios";
import { END } from "redux-saga";
import wrapper from "../../store/configureStore";

const Post = () => {
  const router = useRouter();
  const { id } = router.query;
  const { singlePost } = useSelector((state) => state.post);

  // if (router.isFallback) {
  //   return <div>Loading..</div>
  // }//used with getStaticPaths & getStaticProps
  
  return (
    <Applayout>
      {singlePost ? (
        <>
          <Head>
            <title>{singlePost.User.nickname}'s Post</title>
            <meta name="description" content={singlePost.content} />
            <meta
              property="og:title"
              content={`${singlePost.User.nickname}'s Post`}
            />
            <meta property="og:description" content={singlePost.content} />
            <meta
              property="og:image"
              content={
                singlePost.Images[0]
                  ? singlePost.Images[0].src
                  : "http://wesoodaa.site/favicon.png"
              }
            />
            <meta
              property="og:url"
              content={`http://wesoodaa.site/post/${id}`}
            />
          </Head>
          <PostCard post={singlePost} />
        </>
      ) : 
      <div>No post found.</div>
      }
    </Applayout>
  );
};


// export async function getStaticPaths(){
//   return {
//     paths: [ 
//       { params: {id: '1'}},
//       {params:{id: '2'}},
//       {params: {id: '3'}}, //pages for these are built on server as HTML beforehand
//       //used with export const getStaticProps (if used) below
//     ],
//    fallback: true //this way, pages with id >= 4 do not result in error
//   }
// }

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
      type: LOAD_POST_REQUEST,
      data: context.params.id,
    });
    context.store.dispatch(END);
    await context.store.sagaTask.toPromise(); //sagaTask from configStore
  }
); //SSR,ran before the line below

export default Post;
