import express from 'express'
import { edit,remove,profile,logout } from '../controllers/usersControllers';
const usersRouter = express.Router('/users');



usersRouter.get('/edit',edit)
usersRouter.get('/delete',remove);
usersRouter.get("/:id",profile);
usersRouter.get('/logout',logout);

export default usersRouter