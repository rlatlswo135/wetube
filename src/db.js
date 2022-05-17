import mongoose from "mongoose"
//MongoDB와 연결. connect메서드 사용
mongoose.connect('mongodb://127.0.0.1:27017/wetube');
// mongo shell에 처음 접속시 나오는 Url + db이름(wetube)으로 db에 접근한다 = /wetube

const db = mongoose.connection;
//same mongoose.connections[0] => 연결된 모든 커넥션을보려면 connections(배열을리턴)
//커넥션은 그 배열중 0번째 인덱스만 리턴하는 -> 첫번째 연결만 리턴하는 느낌?
/*
connection은 node의 EventEmitter를 상속한단다.
그래서 공식문서에 .on .once에 대한 설명이 없고
node에 저부분에 있다.
*/


//계속 발생하는 이벤트
db.on("error",(err)=>console.log("DB Error",error))

//once 말그대로 한번만 발생하는 이벤트
db.once("open",()=>console.log('Connet to DB'))


/*
mongoose에 가보면 여러 connection이벤트가 있다 위에적힌건 그중2개인 error,open
error은 느낌그대로고
open은 설명을보면
Emitted after 'connected' 
and
onOpen is executed on 
all of this connection's models.


'connected' 이후에 발생하고 
이 연결의 모든 모델에서 onOpen(그 콜백을 말하는듯? 해당 이벤트핸들러함수)이 실행됩니다.
*/

/*
CRUD
    CREATE
    READ
    UPDATE
    DELETE
*/