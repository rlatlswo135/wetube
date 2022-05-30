import express from 'express'
import { postChangePassword,getChangePassword,postEdit,getEdit,remove,profile,logout,githubOAuth,finishGitHubOAuth } from '../controllers/usersControllers';
import {protectorMiddleWare,publicOnlyMiddleWare} from '../middleWares.js'
const usersRouter = express.Router('/users');


usersRouter.route('/edit').all(protectorMiddleWare)
.get(getEdit).post(postEdit)
// get post에도 프로텍트 미들웨어 쓰고싶지만 일일히 붙여야하니까
// all메서드를 이용해 get post http메서드 상관없이 이 미들웨어를 쓰겠다는 의미

usersRouter.get('/delete',remove);

// 로그아웃은 only로그인 상태일때만이니까 미들웨어로 프로텍트
// 미들웨어처럼 가운데인자에 박히면 해당 url에 대해 미들웨어가 적용되는듯 -> 아마블로깅되있을거 같긴한데
usersRouter.get('/logout',protectorMiddleWare,logout);
usersRouter.route('/change-password').all(protectorMiddleWare)
.get(getChangePassword).post(postChangePassword)

usersRouter.get("/:id",profile);

// 얘내는 로그인 아닐때만 갈수있게 해야하니까 (로그인페이지)
usersRouter.get('/github/start',publicOnlyMiddleWare,githubOAuth)
usersRouter.get('/github/finish',publicOnlyMiddleWare,finishGitHubOAuth)

// 로직을 가만히 들여다보면서 다시 이해하자

export default usersRouter