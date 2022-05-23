// 보통 데이터모델의 파일이름은 Uppercase로 시작한다고 한다.
import mongoose from 'mongoose';

export function formatHashTags(hashtag){
    return hashtag.split(',').map(word => word[0]==='#' ? word : `#${word}`)
}

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

// 스키마레벨 .pre가 미들웨어인듯? -> 공식문서 봐보자
// .pre(middlewareType,function)
// 어쨋든 비동기적으로 움직이니까 2번째에 async함수를 쓰는게 좋을거다
videoSchema.pre('save',async function(){
    /*
    몽구스를 통해 db에 save를 하면('save'이벤트를 썻으니)
    미들웨어니까 이 함수를 거쳐갈거다
    그래서 아래의 콘솔로그가 띄워져서 보일거다
    그리고 document의 this를 참조할수있으니 this는 우리가 save를 하기로한
    document가 될거다 => 중간에 데이터를 바꿔서 저장할수 있다는거

    근데 왜 document가 나오냐면 save가 document 미들웨어중 한놈이기 때문이야
    save,remove,updateOne등 공식문서에 보면 document미들웨어의 종류가있다
    그애들을 쓰면 this가 document를 참조하는거
    */

    /*
    몽구스의 신버전부터는 next()를 쓰는대신 (미들웨어니까)
    promise를 리턴하는 함수를 쓰거나 / async함수를 쓸수있다.
    */
    this.hashTags = formatHashTags(this.hashTags[0])

    console.log('we excute save event',this)

})
/*
공식문서참조. 몽구스의 미들웨어는 document,model,aggregate,query미들 웨어가 있다
미들웨어는 스키마레벨에서 지정되며

각 미들웨어 콜백함수는 각각의 this를 참조한다 -> 즉 화살표함수로 2번째 인자콜백을 넣으면
안될거다 화살표함수의 this랑 일반함수의 this는 다르기때문에
즉 document 미들웨어의 this는 document를 참조하고
model미들웨어의 this는 model을 참조하고 ㅇㅋ?

어쨋든 중요한건 4개다 스키마레벨에서 작동한다는거고 각 미들웨어 종류별로
메서드라고 해야할까.. 그게 다른거지
디폴트는 몽구스가 document 미들웨어라고 생각할거다 하지만
쿼리 미들웨어로 셋하고싶으면 {query:true,document:false}이런 옵션을 넣어서 세팅할수있다는거
아무튼 공식문서를 봐

+몽구스의 미들웨어는 pre / post hooks라고도 불린다

*/

const videoModel = mongoose.model('Video',videoSchema)
export default videoModel
