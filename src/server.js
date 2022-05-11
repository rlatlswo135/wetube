import express from 'express'; //npm+nodejs가 똑똑하니께 알아서 node_module에서 express를 찾아주겟지
import morgan from 'morgan';
// morgan함수를 호출하면. 내가 설정한대로 middleware를 return해준다.
import globalRouter from './routers/globalRouter';
import usersRouter from './routers/usersRouter';
import videosRouter from './routers/videosRouter';
//export-import

const PORT = 4000;
const app = express();
app.use(morgan('dev'))
//morgan을 쓰니까 서버콘솔에 httpMethod,path,statuCode 속도 등의 정보가 나온다.
//middleware랑 같지? 얘를 거쳤으니 서버콘솔에 위의 정보가나오는거고 결국 각 handle함수로 넘어가잖어.


app.use('/',globalRouter);
app.use('/users',usersRouter);
app.use('/videos',videosRouter);






app.listen(PORT,()=>console.log(`----- Server listening on port http://localhost:${PORT} -----`));