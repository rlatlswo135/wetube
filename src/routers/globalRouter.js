import express from 'express';
import { homepage,postSearch,getSearch } from '../controllers/videosControllers';
import { getJoin,postJoin,getLogin,postLogin } from '../controllers/usersControllers';
const globalRouter = express.Router('/');


globalRouter.get('/',homepage)

globalRouter.route('/join')
.get(getJoin)
.post(postJoin)

globalRouter.route('/login').get(getLogin).post(postLogin)
globalRouter.get('/search',getSearch)







export default globalRouter