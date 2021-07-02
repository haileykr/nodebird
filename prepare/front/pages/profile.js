import React, { useEffect } from 'react';
import Head from 'next/head';
import Router from 'next/router';
import {useSelector, useDispatch} from 'react-redux';
import axios from 'axios';
import {END} from 'redux-saga';
import useSWR from 'swr';
import wrapper from '../store/configureStore';

import Applayout from '../components/Applayout';
import NicknameEditForm from '../components/NicknameEditForm';
import FollowList from   '../components/FollowList';
import { LOAD_FOLLOWERS_REQUEST, LOAD_FOLLOWINGS_REQUEST } from '../reducers/user';

const fetcher = (url) => axios.get(url,{withCredentials:true})
    .then(result =>result.data); //configuration for SWR

const Profile = () => {
    const {me} = useSelector((state) => state.user);
    // const followerList = [{nickname: 'BP'}, {nickname: 'chicken'}, {nickname: 'bread'}]
    // const followingList = [{nickname: 'BP'}, {nickname: 'chicken'}, {nickname: 'bread'}]
    const dispatch = useDispatch();

    const {data: followersData, error: followersError} = useSWR('http://localhost:3065/user/followers',fetcher);
    //if both followersData and followersError are null it is still  loading
    const {data: followingsData, error: followingsError} = useSWR('http://localhost:3065/user/followings',fetcher);
    
    useEffect(() => {
        if (!(me && me.id)){
            Router.push('/')
        }
    }, [me &&me.id])

    if (followersError || followingsError){ 
        console.error(followersError || followingsError);
        return "Error occured while fetching followers and followings"
        //reminder
        //return cannot be placed above hooks
        //the same number of hooks must be ran every time
    }

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
                {/* <FollowList header="Following"data={me.Followings}/> */}
                {/* <FollowList header="Follower" data={me.Followers}/> */}
                {/* SWR */}
                <FollowList header="Following"data={followingsData}/>
                <FollowList header="Follower" data={followersData}/>
                
            </Applayout>
        </>
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
      context.store.dispatch(END);
      await context.store.sagaTask.toPromise(); //sagaTask from configStore
    }
  ); //SSR,ran before the line below

export default Profile;