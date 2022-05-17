//import가 너무많아지니까 코드자체를 import하는 부분은 나눠주자
// + 서버를 초기화하는데 관련된 코드를 넣어주자 

import express, { application } from 'express'; //npm+nodejs가 똑똑하니께 알아서 node_module에서 express를 찾아주겟지
import morgan from 'morgan';
import globalRouter from './routers/globalRouter';
import usersRouter from './routers/usersRouter';
import videosRouter from './routers/videosRouter';

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
app.use('/',globalRouter);
app.use('/users',usersRouter);
app.use('/videos',videosRouter);

export default app


