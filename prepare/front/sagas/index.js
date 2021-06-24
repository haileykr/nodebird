import {all, fork} from 'redux-saga/effects'
import axios from 'axios';

import postSaga from './post.js';
import userSaga from './user.js';

axios.defaults.baseURL = "http://localhost:3065";

export default function* rootSaga() {
    yield all([
        fork(postSaga),
        fork(userSaga),
    ]);
};