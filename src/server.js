import express from 'express'; //npm+nodejs가 똑똑하니께 알아서 node_module에서 express를 찾아주겟지
import morgan from 'morgan';
import globalRouter from './routers/globalRouter';
import usersRouter from './routers/usersRouter';
import videosRouter from './routers/videosRouter';

const PORT = 4000;
const app = express();

//use pug -> 사용은 express.set부분에
app.set('view engine','pug')
//1. pug설치 2. pug를 뷰엔진으로 3. pug파일 생성
//process.cwd() => process(현재실행중인 프로그램) + cwd(currently working directory)
// + /views
// console.log(process.cwd()) -> /side_project/wetube (src가아니고?)
/*
현재실행중인 경로는 서버를 실행시킨 즉 node index.js한것처럼 그렇게 서버를 실행시킨(노드를 실행시킨)
녀석의 디렉토리를 가르킬텐데 npm run dev -> package.json이 실행하지?
그러니까 package.json의 디렉토리인 wetube까지만 되는거
*/

app.set('views',process.cwd()+'/src/views');
//그래서 디렉토리를 수정해준모습 express 공식에 프로퍼티(view,view engine등)별 설명이 나와있다
app.use(morgan('dev'))

app.use('/',globalRouter);
app.use('/users',usersRouter);
app.use('/videos',videosRouter);





app.listen(PORT,()=>console.log(`----- Server listening on port http://localhost:${PORT} -----`));