import express from 'express';
import { homepage,postSearch,getSearch } from '../controllers/videosControllers';
import { getJoin,postJoin,getLogin,postLogin } from '../controllers/usersControllers';
import { protectorMiddleWare,publicOnlyMiddleWare } from '../middleWares';

const globalRouter = express.Router('/');

globalRouter.get('/',homepage)

globalRouter.route('/join').all(publicOnlyMiddleWare)
.get(getJoin).post(postJoin)

// 마찬가지로 로그인상태인데 로그인 url에 접근하면 안되니까 public으로 프로텍트
globalRouter.route('/login').all(publicOnlyMiddleWare)
.get(getLogin).post(postLogin)

globalRouter.get('/search',getSearch)







export default globalRouter