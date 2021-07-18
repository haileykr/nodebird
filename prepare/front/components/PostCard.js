import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import moment from "moment";

import { useSelector, useDispatch } from "react-redux";
import { Button, Card, Popover, Avatar, List, Comment } from "antd";
import {
  RetweetOutlined,
  HeartTwoTone,
  HeartOutlined,
  MessageOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";

import PostImages from "./PostImages";
import CommentForm from "./CommentForm";

import PostCardContent from "./PostCardContent";
import FollowButton from "./FollowButton";
import {
  REMOVE_POST_REQUEST,
  LIKE_POST_REQUEST,
  UNLIKE_POST_REQUEST,
  RETWEET_REQUEST,
} from "../reducers/post";

// moment.locale("ko");

const PostCard = ({ post }) => {
  // post is what we got from parents
  // through loops
  const dispatch = useDispatch();
  const { removePostLoading } = useSelector((state) => state.post);
  // const [liked, setLiked] = useState(false);
  const [commentFormOpened, setCommentFormOpened] = useState(false);

  const { me } = useSelector((state) => state.user);
  // const id = me && me.id;
  // equivalent to
  const id = me?.id;

  const liked = post.Likers.find((v) => v.id === id);
  // "optional chaining  OPERATOR!"

  const [editMode, setEditMode] = useState(false);

  const onClickUpdate = useCallback(() => {
    setEditMode(true);
  }, []);

  const onCancelUpdatePost = useCallback(() => {
    setEditMode(false);
  }, []);
  const onChangePost = useCallback(
    (editText) => () => {
      dispatch({
        type: UPDATE_POST_REQUEST,
        data: {
          PostId: post.id,
          content: editText,
        },
      });
    },
    [post]
  );

  const onLike = useCallback(() => {
    // setLiked((prev) => !prev);

    // prev has the previous state. useState -liked/setliked

    if (!id) {
      return alert("Login required");
    }

    return dispatch({
      type: LIKE_POST_REQUEST,
      data: post.id,
    });
  }, []);

  const onUnlike = useCallback(() => {
    if (!id) {
      return "Login required";
    }
    return dispatch({
      type: UNLIKE_POST_REQUEST,
      data: post.id,
    });
  }, []);
  const onToggleComment = useCallback(() => {
    setCommentFormOpened((prev) => !prev);
  }, []);

  const onRemovePost = useCallback(() => {
    if (!id) {
      return alert("Login required");
    }

    return dispatch({
      type: REMOVE_POST_REQUEST,
      data: post.id,
    });
  }, []);

  const onRetweet = useCallback(() => {
    if (!id) {
      return alert("Login required");
    }
    return dispatch({
      type: RETWEET_REQUEST,
      data: post.id,
    });
  }, [id]);

  return (
    <div style={{ marginBottom: 20 }}>
      <Card
        // cover와 actions모두 antd기능
        cover={post.Images[0] && <PostImages images={post.Images} />}
        actions={[
          <RetweetOutlined key="retweet" onClick={onRetweet} />,
          liked ? (
            <HeartTwoTone
              twoToneColor="#eb2f96"
              key="heart"
              onClick={onUnlike}
            />
          ) : (
            <HeartOutlined key="heart" onClick={onLike} />
          ),
          <MessageOutlined key="comment" onClick={onToggleComment} />,
          <Popover
            key="more"
            content={
              <Button.Group>
                {/* 로그인 시에만 보이게 */}
                {id && post.User.id === id ? (
                  <>
                    {!post.RetweetId && (
                      <Button onClick={onClickUpdate}>Edit</Button>
                    )}
                    <Button
                      type="danger"
                      loading={removePostLoading}
                      onClick={onRemovePost}
                    >
                      Remove
                    </Button>
                  </>
                ) : (
                  <Button>Report</Button>
                )}
              </Button.Group>
            }
          >
            {/* 더보기버튼 */}
            <EllipsisOutlined />
          </Popover>,
        ]}
        title={post.RetweetId ? `${post.User.nickname} retweeted` : null}
        extra={id && <FollowButton post={post} />}
      >
        {post.RetweetId && post.Retweet ? (
          <Card
            cover={
              post.Retweet.Images[0] && (
                <PostImages images={post.Retweet.Images} />
              )
            }
          >
            <div styel={{ float: "right" }}>
              {moment(post.createdAt).format("MM / DD / YYYY")}
              {/* new Date().getFullYear + new Date().getMonth +new Date().getDate */}
            </div>
            <Card.Meta
              avatar={
                <Link prefetch={false} href={`/user/${post.Retweet.User.id}`}>
                  <a>
                    <Avatar>{post.Retweet.User.nickname[0]}</Avatar>{" "}
                  </a>
                </Link>
              }
              title={post.Retweet.User.nickname}
              description={
                <PostCardContent
                  editMode={editMode}
                  onChangePost={onChangePost}
                  onCancelUpdatePost={onCancelUpdatePost}
                  postData={post.Retweet.content}
                />
              }
            />
          </Card>
        ) : (
          <>
            <div style={{ float: "right" }}>
              {moment(post.createdAt).format("MM / DD / YYYY")}
            </div>
            <Card.Meta
              avatar={
                <Link prefetch={false} href={`/user/${post.User.id}`}>
                  <a>
                    <Avatar>{post.User.nickname[0]}</Avatar>{" "}
                  </a>
                </Link>
              }
              title={post.User.nickname}
              description={
                <PostCardContent
                  postData={post.content}
                  onChangePost={onChangePost}
                  onCancelUpdatePost={onCancelUpdatePost}
                />
              }
            />
          </>
        )}
      </Card>
      {commentFormOpened && (
        <div>
          <CommentForm post={post} />
          {/* 게시글의 id를 comment가 받아야하기 때문에 post 넘겨줌! */}
          <List
            header={`
              ${post.Comments ? post.Comments.length : "0"} comments`}
            itemLayout="horizontal"
            dataSource={post.Comments}
            // post.Comments 각각이 item으로 들어감
            renderItem={(item) => (
              <li>
                <Comment
                  author={item.User.nickname}
                  avatar={
                    <Link prefetch={false} href={`/user/${item.User.id}`}>
                      <a>
                        <Avatar>{item.User.nickname[0]}</Avatar>{" "}
                      </a>
                    </Link>
                  }
                  content={item.content}
                />
              </li>
            )}
          />
        </div>
      )}
    </div>
  );
};

PostCard.propTypes = {
  // post: PropTypes.object.isRequired,
  // 혹은 더 자세히 명시해주기 위해서
  post: PropTypes.shape({
    id: PropTypes.number,
    User: PropTypes.object,
    content: PropTypes.string,
    createdAt: PropTypes.string,
    Comments: PropTypes.arrayOf(PropTypes.object),
    Images: PropTypes.arrayOf(PropTypes.object),
    Likers: PropTypes.arrayOf(PropTypes.object),
    RetweetId: PropTypes.number,
    Retweet: PropTypes.objectOf(PropTypes.any),
  }).isRequired,
};

export default PostCard;
