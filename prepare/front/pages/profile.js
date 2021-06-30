import React, { useEffect } from 'react';
import Head from 'next/head';
import Router from 'next/router';
import {useSelector, useDispatch} from 'react-redux';

import Applayout from '../components/Applayout';
import NicknameEditForm from '../components/NicknameEditForm';
import FollowList from   '../components/FollowList';
import { LOAD_FOLLOWERS_REQUEST, LOAD_FOLLOWINGS_REQUEST } from '../reducers/user';

const Profile = () => {
    const {me} = useSelector((state) => state.user);
    // const followerList = [{nickname: 'BP'}, {nickname: 'chicken'}, {nickname: 'bread'}]
    // const followingList = [{nickname: 'BP'}, {nickname: 'chicken'}, {nickname: 'bread'}]
    const dispatch = useDispatch();
    
    useEffect(() => {
        if (!(me && me.id)){
            Router.push('/')
        }
    }, [me &&me.id])

    if (!me){ 
        return null;
    }

    useEffect(() => {
        dispatch({
            type:LOAD_FOLLOWERS_REQUEST
        })
        dispatch({
            type:LOAD_FOLLOWINGS_REQUEST
        })
    }, []);
    
    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <title>My Profile - NodeBird</title>
            </Head>
            <Applayout>
                <NicknameEditForm />
                <FollowList header="Following"data={me.Followings}/>
                <FollowList header="Follower" data={me.Followers}/>
            </Applayout>
        </>
    );
};

export default Profile;