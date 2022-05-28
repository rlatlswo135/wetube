import express from 'express'
import { edit,remove,profile,logout,githubOAuth,finishGitHubOAuth } from '../controllers/usersControllers';
const usersRouter = express.Router('/users');


usersRouter.get('/edit',edit)
usersRouter.get('/delete',remove);
usersRouter.get("/:id",profile);
usersRouter.get('/logout',logout);

usersRouter.get('/github/start',githubOAuth)
usersRouter.get('/github/finish',finishGitHubOAuth)

/*
깃허브로로그인 누르면 -> /github/start로 겟요청, 해당 컨트롤러가 깃허브OAUth에 맞는 경로로 리다이렉트
-> 인증하면 깃허브에 세팅한 리다이렉트경로로 리다이렉트 (finish)(get 요청)
-> 그럼 finish로 겟요청햇으니 finish컨트롤러
-> finish컨트롤러가 다시 엑세스토큰을 얻기위해 post요청 보내는 기능이 내장되어있음
->(짯으니까) fetch를 이용해 post요청. 데이터는 공식문서에 나와있는대로 쿼리로 보냄
-> 엑세스토큰 오겠지
*/

export default usersRouter