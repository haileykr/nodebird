import React from "react";
import { useSelector } from "react-redux";
import { END } from "@redux-saga/core";
import Head from "next/head";
import { Avatar, Card } from "antd";
import Applayout from "../components/Applayout";
import wrapper from "../store/configureStore";
import { LOAD_USER_REQUEST } from "../reducers/user";

const About = () => {
  const { userInfo } = useSelector((state) => state.user);
  return (
    <Applayout>
      <Head>
        <title> About - WeSoodaa</title>
      </Head>
      {userInfo ? (
        <Card
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
            <div key="followers">
              Followers
              <br />
              {userInfo.Followers}
            </div>,
          ]}
        >
          <Card.Meta
            avatar={<Avatar>{userInfo.nickname[0]}</Avatar>}
            title={userInfo.nickname}
            description="WeSoodaa"
          />
        </Card>
      ) : null}
    </Applayout>
  );
};
// export const getStaticProps = wrapper.getStaticProps(async (context) => {
export const getServerSideProps = wrapper.getServerSideProps(
  async (context) => {
    context.store.dispatch({
      type: LOAD_USER_REQUEST,
      data: 1,
    });
    context.store.dispatch(END);
    await context.store.sagaTask.toPromise();
  }
);

export default About;
