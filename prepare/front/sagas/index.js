import {all, fork} from 'redux-saga/effects'
import axios from 'axios';

import postSaga from './post.js';
import userSaga from './user.js';

import { backUrl } from  '../config/config';

axios.defaults.baseURL = backUrl;
axios.defaults.withCredentials = true;

export default function* rootSaga() {
    yield all([
        fork(postSaga),
        fork(userSaga),
    ]);
};