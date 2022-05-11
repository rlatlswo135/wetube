import express from 'express'
import { edit,remove,profile,logout } from '../controllers/usersControllers';
const usersRouter = express.Router('/users');



// 라우터안에있기때문에 path 를 /users/edit안해도 된다 (users라우터 안이니까)
usersRouter.get('/edit',edit)
//그래서 /users라우터안에 /edit을 받을 준비가 됬으니까 /users/edit  이된거
// 1. /user로들어감 -> usersRouter실행 (위에 app.use)
// 2. usersRouter안에 있는 controller찾을꺼임 -> 마침 edit이 있네. -> /users/edit

usersRouter.get('/delete',remove);
//url params
usersRouter.get("/:id",profile);
usersRouter.get('/logout',logout);

export default usersRouter