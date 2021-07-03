import React, { useEffect, useState, useCallback } from 'react';
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
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';

import { backUrl } from "../config/config";

const fetcher = (url) => axios.get(url,{withCredentials:true})
    .then(result =>result.data); //configuration for SWR

const Profile = () => {
    const {me} = useSelector((state) => state.user);
    // const followerList = [{nickname: 'BP'}, {nickname: 'chicken'}, {nickname: 'bread'}]
    // const followingList = [{nickname: 'BP'}, {nickname: 'chicken'}, {nickname: 'bread'}]
    const dispatch = useDispatch();
    const [followersLimit, setFollowerLimit] = useState(3);
    const [followingsLimit, setFollowingsLimit] = useState(3);

    const {data: followersData, error: followersError} = useSWR(`${backUrl}/user/followers?limit=${followersLimit}`,fetcher);
    //if both followersData and followersError are null it is still  loading
    const {data: followingsData, error: followingsError} = useSWR(`${backUrl}/user/followings?limit=${followingsLimit}`,fetcher);
    
    useEffect(() => {
        if (!(me && me.id)){
            Router.push('/')
        }
    }, [me &&me.id])

    const loadMoreFollowings = useCallback(()=>{
        setFollowingsLimit((prev) => prev+3);
    }, []);

    const loadMoreFollowers = useCallback(() => {
        setFollowersLimit((prev) => prev + 3);
    },[]);

    if (!me){ 
        return null;
    }

    if (followersError || followingsError){ 
        console.error(followersError || followingsError);
        return "Error occured while fetching followers and followings"
        //reminder
        //return cannot be placed above hooks
        //the same number of hooks must be ran every time
    }


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
                <FollowList header="Following"data={followingsData} onClickMore = {loadMoreFollowings} loading={!followingsData &&  !followingsError}/>
                <FollowList header="Follower" data={followersData} onClickMore = {loadMoreFollowers} loading = {!followersData && !followersError }/>
                
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