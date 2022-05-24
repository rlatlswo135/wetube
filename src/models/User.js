import mongoose from 'mongoose';
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
    // email , userName은 db상 1개여야되잖어?
    email:{type:String,required:true,unique:true},
    userName:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    location:String
})



userSchema.pre('save',async function(){
    console.log(`password`,this.password)
    this.password = await bcrypt.hash(this.password,5)
    // bcrypt의 3번째인자는 콜백을 받는데
    // 콜백대신 promise / async 를 지원한다 그래서 await이 붙은모습 (async사용)
    // 2번째인자의 숫자는 해시를 반복할 수다 해쉬된문자를 또해쉬하고 해쉬된문자를 또해쉬하고
    // 그걸 5번한다고
    console.log(`password`,this.password)
})

// 정~~~말 중요한게 모델을 만들기전에 미들웨어가 세팅이 되어있어야한다
// 모델은 스키마를 기반으로 만드는데 그 스키마레벨에서 미들웨어를 추가해주는거기때문에
// 모델을 만들기전 스키마에 미들웨어를 세팅하고 + 세팅된스키마를 기반으로 모델을 만드는거지

const userModel = mongoose.model('User',userSchema)
export default userModel

/*
스키마생성 -> 생성한스키마 기반으로 model생성 -> document생성
*/