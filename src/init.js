/*
관련된것들끼리 묶기위해.
server는 서버와 관련된 로직을.
db는 말그대로 db관련
init은 서버에 관련된 로직에 필요한 import를 담당하는역할
*/
import "./db"
// 여기도 중요하다. 이 전체코드를 import해와야지 돌아갈거니까
import "./models/Video" //일단 주석처리해도 문제는 없다
import "./models/User"
// 사실 여기서 model.js를 쓰는 부분은 없어서 주석처리해도 되긴하는데.. 외import해주는거지?;

import app from "./server"

const PORT = 4000;


app.listen(PORT,()=>console.log(`----- Server listening on port http://localhost:${PORT} -----`));
