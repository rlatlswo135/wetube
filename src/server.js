import express from 'express'; //npm+nodejs가 똑똑하니께 알아서 node_module에서 express를 찾아주겟지
const PORT = 4000;
//Creates an Express application
const app = express();

//서버가 request listening하기 전에 http method에 따른 response를 어떻게 보낼건지 정의해줘야겠지?
function handleGetHome(req,res){
    /*
    '/'로 get request가 오면 express가 handleGetHome함수에 인자 2개를 넣어서줄건데 각각 obj이고
    request,response오브젝트를 넘겨줄거다

    중요한건 request를 받았으면 response를 해줘야하잖아? 
    -> 그래서 꼭 res를 return해야함(안그럼 브라우저가 계속 res받을때까지 req보내면서 대기하겠지)
    어쨋든모~~~든 건 똑같다. request -> response의 상호작용. (클라이언트 - 서버의 상호작용)
    */
//    return res.end();
   //말그대로 end. => response하는데 request를 end한다는 답을 하는거지
   return res.send({message:"JSON send"})
   /*
   응답을 텍스트로 보낸다는 (send) 공식문서에 보면 status와 더불어 체이닝해서
   html엘리먼트를 보내던지 JSON을 보내던지 할수있다.
   */
   
}
app.get('/',handleGetHome)
//마찬가지로 해당이름의 요청이 들어오면 실행할 함수를 2번째인자에 (콜백)
function handleLogin(req,res){
    return res.send('<h1>you come to login</h1>')
}
app.get('/login',handleLogin)

/*
'/'로의 get요청은 인제 cannot get/이 안뜰거다 왜냐면 서버가 '/'에 get요청에대해선 응답할 준비가됬으니까
하지만 실질적으로 보내는게 없으니까 계속 로딩중인거지(브라우저가 계속 /에 request중이란거)
*/





app.listen(PORT,()=>console.log(`----- Server listening on port http://localhost:${PORT} -----`));
/*
listen => request를! => 서버! listen해라! 근데 어떤 port를 listen할건지.
listen하면 실행할 함수를 2번째인자에 (콜백)
port에 대해 배워서 알겠지만 할당된 포트도있지? 개내는 피해야겟지? => 보통높은 번호의 포트는 비어있으니.

그럼 4000번 포트로 열었고 들어가보면! -> cannot GET/ 이긴하지만 연결할수없는게아니라
응답이 온거다! 아직 응답을 정해주지 않았을뿐! -> 서버가 열렸다!

cantnot get / ? => 브라우저가 '/'로 'GET' request를 한거지
*/