import React, {useCallback, useState, useRef, useEffect} from 'react';
import { Form, Input,Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { addPost, UPLOAD_IMAGES_REQUEST } from '../reducers/post';
import useInput from '../hooks/useInput'


const PostForm = () => {
    const {imagePaths,addPostDone}=useSelector((state) => state.post);
    const dispatch = useDispatch();
    const imageInput =useRef();
    const [text, onChangeText, setText] = useInput('');

    useEffect(() => {
        if (addPostDone){
            setText('');
        }
    }, [addPostDone]);
    
    
    const onSubmit = useCallback(() => {
        dispatch(addPost(text));
        // addPost is an object!
        // reminder - action is originally an object
        // if you want to dynamically create an action, make a function called 'action creator'
    }, [text]);
    
    const onClickImageUpload = useCallback(() => {
        imageInput.current.click();
    }, [imageInput.current]);
    
    const onChangeImages = useCallback((e) => {
        console.log("images", e.target.files);
        const imageFormData = new FormData(); // with FormData you can send images as "multipart" 

        [].forEach.call(e.target.files,(f) => {
            imageFormData.append('image', f); //"image" == the "name" of the input
        });
        dispatch({

            type:UPLOAD_IMAGES_REQUEST,
            data:imageFormData            
        })
    }, []);
    
    
    return (
        <Form style={{ margin: '10px 0 20px'}} encType = "multipart/form-data" onFinish = {onSubmit}>
            {/* inline-style말고 빼는 게 좋지만 일단은 간단하게 */}
            {/* 성능에 문제가 있을 때 나중에 뺴는 것도 괜찮은 방법임 */}
            <Input.TextArea
            value={text}
            onChange={onChangeText}
            maxLength={140}
            placeholder = "What do you wanna share?"
            />
            <div>
                <input type ="file" name = "image" multiple hidden onChange={onChangeImages}ref={imageInput} />
                {/*  DOM에 접근할 때 ref사용 */}
                <Button onClick = {onClickImageUpload}>Upload image(s)</Button>
                <Button type = "primary" style = {{ float:  'right'}} htmlType="submit">Tweet</Button>
            </div>
            <div>
                
            {imagePaths.map((v) => (
                // image preview!
                <div key = {v} style = {{ display: 'inline-block'}}>
                    <img src = {`http://localhost:3065/${v}`} style = {{width: '200px'}} alt = {v}></img>
                <div>
                    <Button>Remove</Button>
                </div>
                </div>

            ))}
            </div>


        </Form>
    )
}

export default PostForm;