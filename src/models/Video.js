// 보통 데이터모델의 파일이름은 Uppercase로 시작한다고 한다.
import mongoose from 'mongoose';


const videoSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true,
        uppercase:true
        // String.trim()은 js도 있는거고 양쪽의 공백을 제거해준다
        // 요리할때 고기 트리밍하는거마냥
    },
    description:String,
    createAt:{type:Date,required:true,default:Date.now},
    // default를 통해서 말그대로 default를설정해줄수 있는데
    // 함수도 쓸수있다 하지만 호출을하진말고.
    hashTags:[
        {type:String,required:true,trim:true}
        // 해쉬태그가 필수인게 맞나?
    ],
    meta:{
        views:{type:Number,default:0},
        rating:{type:Number,default:0}
        // 아무튼 이렇게 default를 설정하면 create할때 멍청하게 입력하지 않는부분까지
        // 타이핑해서 데이터를 넣어줄 필요가 없겠지?
    }
    // what is meta data
})

const videoModel = mongoose.model('Video',videoSchema)
export default videoModel
