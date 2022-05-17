/*
관련된것들끼리 묶기위해.
server는 서버와 관련된 로직을.
db는 말그대로 db관련
init은 서버에 관련된 로직에 필요한 import를 담당하는역할
*/
import "./db"
import "./models/Video"
import app from "./server"

const PORT = 4000;


app.listen(PORT,()=>console.log(`----- Server listening on port http://localhost:${PORT} -----`));
