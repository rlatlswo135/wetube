import express from 'express';
import { homepage,search } from '../controllers/videosControllers';
import { join,login } from '../controllers/usersControllers';
const globalRouter = express.Router('/');


globalRouter.get('/',homepage)
globalRouter.get('/join',join)
globalRouter.get('/login',login)
globalRouter.get('/search',search)







export default globalRouter