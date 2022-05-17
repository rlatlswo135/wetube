// 보통 데이터모델의 파일이름은 Uppercase로 시작한다고 한다.
import mongoose from 'mongoose';


const videoSchema = new mongoose.Schema({
    title:String,
    description:String,
    createAt:Date,
    hashTags:[
        {type:String}
    ],
    meta:{
        views:Number,
        rating:Number
    }
    // what is meta data
})

// 데이터모델은 1번째가 upperCase인게 국룰이랜다.
const videoModel = mongoose.model('Video',videoSchema)
export default videoModel
/*
mongoose에 모든것은 스키마로부터 파생된다.

모델의 인스턴스를 document라고 하고,
그렇다면 Model은 document들의 클래스일꺼다.
각 document는 스키마에 선언된 속성 + 동작을 가진녀석들이 될거다

*/