import mongoose from "mongoose"
//MongoDB와 연결. connect메서드 사용
mongoose.connect('mongodb://127.0.0.1:27017/wetube');
// mongo shell에 처음 접속시 나오는 Url + db이름(wetube)으로 db에 접근한다 = /wetube
// wetube라는 db가 비엇다면 이후 document(모델의 인스턴스)생성시
// wetube라는 이름으로 db가 생성될거고(없는데 wetube에 접근한다고 했으니까). 거기에 저장될거다.


const db = mongoose.connection;

//계속 발생하는 이벤트
db.on("error",(err)=>console.log("DB Error",error))

//once 말그대로 한번만 발생하는 이벤트
db.once("open",()=>console.log('Connet to DB'))
