//import가 너무많아지니까 코드자체를 import하는 부분은 나눠주자
// + 서버를 초기화하는데 관련된 코드를 넣어주자 

import express, { application } from 'express'; //npm+nodejs가 똑똑하니께 알아서 node_module에서 express를 찾아주겟지
import morgan from 'morgan';
import session from 'express-session'
import MongoStore from 'connect-mongo'
import globalRouter from './routers/globalRouter';
import usersRouter from './routers/usersRouter';
import videosRouter from './routers/videosRouter';
import mongoose from 'mongoose';
import {localsMiddleWare} from "./middleWares.js"

// db.js파일 자체를 import하는 모습 -> 모듈화가 필요없이 db.js에 적힌건 모두 실행될거

const app = express();

//use pug -> 사용은 express.set부분에
app.set('view engine','pug')
app.set('views',process.cwd()+'/src/views');
//그래서 디렉토리를 수정해준모습 express 공식에 프로퍼티(view,view engine등)별 설명이 나와있다
app.use(morgan('dev'))
// req.body => 없지
app.use(express.urlencoded({extended:true}))
// req.body => 있지, => express.urlencoded미들웨어를 거쳤을때 나오는 메소드니까

// express-session라이브러리 이용 (express내 세션기능 써주는)
app.use(session({
    secret:process.env.COOKIE_SECRET,
    // store:MongoStore.create({mongoUrl:"mongodb://127.0.0.1:27017/wetube"}),

    //위 아래는 같다.

    store:MongoStore.create({client:mongoose.connection.client}),
    /*
    store라는 프로퍼티는 기본인 memoryStore 대신 내가원하는놈을 쓰는거다
    mongo쉘로 가보면 show collections에 sessions콜렉션이 생긴걸 볼수있다
    거기에 우리의 세션 즉 브라우저연결 정보가 들어갈듯 그리고 세션(연결)정보가 db에 저장되니까 새로고침해도 휘발되지않을거다 다만 만료시간은 있겠지
    */
    resave:false,
    saveUninitialized:false
}))

// 미들웨어의 순서중요할거다 만약 아래 + 위가 바뀐다면
// 쿠키에 세션아이디를 넣지도 않았는데 req.session을 참조할테니까

app.use(localsMiddleWare)
//경로가 없으면 전역적으로 되는 미들웨어인듯?

app.use('/',globalRouter);
app.use('/users',usersRouter);
app.use('/videos',videosRouter);

export default app


