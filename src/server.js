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
    /*
    브라우저가 최초요청 (홈페이지에접속) 시 서버로부터 세션ID가 담긴 쿠키를 받겠지?
    그게 여기부분. 서버가 세션ID를 담아서 넘겨주는건데 그걸 express-session패키지가 해준다

    쿠키에 세션ID가 아닌 직접적인 세션데이터를 넣고싶으면 cookie-session 미들웨어를 쓰면 됨
    */
    secret:"Hello",
    // store:MongoStore.create({mongoUrl:"mongodb://127.0.0.1:27017/wetube"}),

    //위 아래는 같다. mongoUrl프로퍼티는 url을 이용해 새로운 MongoClient 커넥션을 만드는데
    //지금 이미 mongoose를 이용해 mongoDB와의 연결을 만들었기때문에 그 연결을 써준거다.(아래)
    // client프로퍼티가 그걸 가능하게함

    store:MongoStore.create({client:mongoose.connection.client}),
    /*
    store라는 프로퍼티는 기본인 memoryStore 대신 내가원하는놈을 쓰는거다
    mongo쉘로 가보면 show collections에 sessions콜렉션이 생긴걸 볼수있다
    거기에 우리의 세션 즉 브라우저연결 정보가 들어갈듯

    그리고 세션(연결)정보가 db에 저장되니까 새로고침해도 휘발되지않을거다 다만 만료시간은 있겠지
    */
    resave:false,
    saveUninitialized:true
    /*
    사용법은 공식문서를 보고, 각옵션이 뭔지는 구글링
    https://github.com/expressjs/session 요기에 각 옵션에대한 설명
    여기가브라우저한테 쿠키를 셋해주는. (미들웨어니까 리퀘스트 리스닝하기전에 보낼거))
    */

    /*
    express-session은 세션을 기본적으로 MemoryStorage에 저장하기때문에 서버를
    리스타트하면 세션정보를 다 잊을거다 (마치 data를 js파일에적어 fakedb를 만들었을때처럼)

    => 그래서 memoryStore가 아닌 MongoDB-based session store를 쓸건데
    공식문서에는 connect-store를 설치하면 된다고 되어있다
    */
}))

// 추가로 미들웨어의 추가순서도 중요할거다 만약 아래 + 위가 바뀐다면
// 쿠키에 세션아이디를 넣지도 않았는데 req.session을 참조할테니까
// 미들웨어는 순서가 중요하다 정말로!

app.use((req,res,next) => {
    console.log(req.sessionStore) // memoryStore
    req.sessionStore.all((err,sessions) => {
        console.log('seesions',sessions);
        next();
    })
    //현재 연결된 세션들을 보는거 express에서 req.sessionStore가 뭔지 봐보자
    // = 서버가 기억하고있는 브라우저들을 보여주는거

    /*
    알지만 다시. -> 브라우저가 서버에 최초연결 ( 서버가 쿠키에 세션야이디 담아서 넘김 )
    브라우저가 다음 요청시마다 세션아이디 담긴 쿠키를 같이넘김
    서버가 확인후 데이터 전송
    */
})

app.get('/add-one',(req,res)=>{
    req.session.customData +=1;
    return res.send(`${req.session.id} => ${req.session.customData}`)
    // 그 세션아이디를 쿠키에 담아서 주는거다 그니까 쿠키기반인거고
    /*
    서버측에서는 해당 세션아이디를 기억하고. 그세션아이디에 맞는 데이터를 보내줄건데
    세션아이디받음 -> 데이터찾음 -> 넘겨줌 이런메커니즘이지
    어쨋든 세션은 한연결단위를 말하고 세션스토리지는 브라우저 단위로 데이터를 공유한다
    (세션스토리지가 세션데이터가 담긴 스토리지인지는 모르지만 일단 어감상)

    세션은 서버단에서 저장하고있는 데이터고 브라우저가 쿠키에 가진 세션아이디로 인증후
    서버는 그에맞는 세션데이터를 넘겨줄거다

    위에는 세션데이터를 커스텀해서 보내주는모습인거고,

    당연한거지만 request에 세션데이터기때문에 브라우저마다 다를거다
    */
})

// 다시한번 순서생각.

app.use((req,res,next) => {
    //경로가 없으면 전역적으로 세팅되는 미들웨어인듯
    const {isLogin,user} = req.session
    // login시 postLogin쪽에서 req.session에 isLogin으로 넣어준다
    res.locals.isLogin = Boolean(isLogin)
    // Boolean으로 undefined가 나와도 false로 저장되게
    if(isLogin){
        // login상태여야 user를 넘겨주는데
        // isLogin과 user는동시에 바뀌니까 코드를 좀더깔끔하게 바꿀수 있을것같긴하다

        res.locals.user = user;
    }
    // 당연하지만 세션데이터기때문에 브라우저(탭)별이다 (세션스토리지가 탭별)
    // 그러니까 다른브라우저에서는 세션데이터의 isLogin은 false일꺼야
    // 왜 로그인을 해야 postLogin이 세션데이터 isLogin에 true로 넘겨주니까
    //  locals에 저장 + 상위 미들웨어했으니 로그인상태를 템플릿엔진쪽에서 쓸수있으거다
    next();
})

app.use('/',globalRouter);
app.use('/users',usersRouter);
app.use('/videos',videosRouter);

export default app


