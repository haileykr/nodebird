import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Avatar, Button } from "antd";

import Link from "next/link";

import { logoutRequestAction } from "../reducers/user";

const UserProfile = ({}) => {
  const dispatch = useDispatch();
  const { me, logOutLoading } = useSelector((state) => state.user);
  const onLogOut = useCallback(() => {
    //setIsLoggedIn(false);
    dispatch(logoutRequestAction());
  }, []);

  return (
    <Card
      actions={[
        <Link href={`/user/${me.id}`}>
          <a>
            <div key="tweet">
              Tweets
              <br />
              {me.Posts.length}
            </div>
          </a>
        </Link>,
        <Link href="profile">
          <a>
            <div key="followings">
              Followings
              <br />
              {me.Followings.length}
            </div>
          </a>
        </Link>,
        <Link href="profile">
          <a>
            <div key="followers">
              Followers
              <br />
              {me.Followers.length}
            </div>
          </a>
        </Link>,
      ]}
    >
      <Card.Meta
        avatar={
          <Link href={`/user/${me.id}`}>
            <a>
              <Avatar>{me.nickname[0]}</Avatar>{" "}
            </a>
          </Link>
        }
        title={me.nickname}
      />
      <Button onClick={onLogOut} loading={logOutLoading}>
        Log Out
      </Button>
    </Card>
  );
};

export default UserProfile;
