import React, { useEffect } from "react";
import Link from "next/link";
import PropTypes from "prop-types";
import { Button, Input } from "antd";

const { TextArea } = Input;

const PostCardContent = ({
  postData,
  editMode,
  onChangePost,
  onCancelUpdatePost,
}) => {
  const { updatePostLoading, updatePostDone } = useSelector(
    (state) => state.post
  );

  // props can't be changed
  // but states can be!! so add this line
  const [editText, setEditText] = useState(postData);
  const onChangeText = useCallback((e) => {
    setEditText(e.target.value);
  });

  useEffect(() => {
    if (updatePostDone) {
      onCancelUpdatePost();
    }
  }, [updatePostDone]);

  return (
    //ex. 'First article #GME #APL'
    <div>
      {editMode ? (
        <>
          <TextArea value={editText} onChange={onChangeText} />
          <Button.Group>
            <Button
              loading={updatePostLoading}
              onClick={onChangePost(editText)}
            >
              Edit
            </Button>
            <Button type="danger" onClick={onCancelUpdatePost}>
              Cancel
            </Button>
          </Button.Group>
        </>
      ) : (
        postData.split(/(#[^\s#]+)/g).map((v, i) => {
          if (v.match(/(#[^\s#]+)/g)) {
            return (
              <Link prefetch={false} key={i} href={`/hashtag/${v.slice(1)}`}>
                <a>{v}</a>
              </Link>
            );
            // Link는 넥스트의 링크임 - slice는 # 뗀 것
            // 함수 map을 쓰므로 key가 필요함
          }
          return v; //일반 문자열이면 그냥 반환
        })
      )}
    </div>
  );
};

PostCardContent.propTypes = {
  postData: PropTypes.string.isRequired,
  editMode: PropTypes.bool,
  onChangePost: PropTypes.func.isRequired,
  onCancelUpdatePost: PropTypes.func.isRequired,
}; //when sth is not required, it's a good practice to assign a default prop

// Retweeted posts do not have editMode
PostCardContent.defaultProps = {
  editMode: false,
};

export default PostCardContent;
