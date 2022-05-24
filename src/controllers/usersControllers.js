import userModel from '../models/User';
import bcrypt from "bcrypt"

export function getJoin(req,res){
    return res.render('join',{
        pageTitle:'회원 가입',
        errMsg:""
    })
}
export async function postJoin(req,res){
    const {userName,email,password,password2,location} = req.body;
    const pageTitle = '회원 가입'
    if(password !== password2){
        return res.status(400).render('join',{
            pageTitle,
            errMsg:"password not correct"
        })
    }

    const existUser = await userModel.exists({$or:[
        {userName},
        {email}
    ]})
    if(existUser){
        // 이렇게 statuscode 400을 추가하면(안됬다는 뉘양스읰 ㅗ드) 비밀번호 추가하시겠습니까 이런거 안나온다
        // 브라우저가 부정적인 코드를 이해했으니까
        return res.status(400).render('join',{
            pageTitle:'회원 가입',
            errMsg:"exist username / email"
        })
    }
    // 확인
    await userModel.create({
        userName,
        email,
        password,
        location
    })
    /*
    하지만 password가 db에 저장된모습을 보면 적나라하다. 나름의 보안조치를 취해야함
    password hash -> bcrypt라는 패키지를 쓸거.
    rainbow table를 가진 해킹공격을 막아준댄다. -> salt를 쓰게끔 되어있으니까
    */
    return res.redirect('/')
    /*
    패스워드틀림 / 이메일중복 등으로 계정생싱이 안됬는데도 브라우저는 이 암호를 저장하시겠습니까?
    라는 메시지가 뜨는데 이는 상태코드를 지정을 안해줘서그런다
    그래서 계정생성이안됬으면 상태코드를 넘겨줘야 브라우저가 해석하고 저런걸 안띄울거같ㅇ다
    우리는 지금 세팅을안했으니 리다이렉트시 200코드로 넘어가서 ok 계정생성됬구나하고 띄우는거

    위키피디아 status code참조하자

    알맞은 상태코드를 보내는건 중요하다 우리가 방문한 페이지들의 히스토리를 브라우저가 기록하는데
    400번대의 페이지는 올바르지않는 상태코드기때문에 기록을 안할거다 즉 유저 경험이 더 좋아질수 있다는거에서
    꽤나 중요한 부분이다(마찬가지로 안됬는데 비번읆 묻는것도 유저경험이 안좋아진다는거지)
    */
}
export function getLogin(req,res){
    return res.render('login',{pageTitle:'login',errMsg:""})
}
export async function postLogin(req,res){
    const pageTitle = "login"
    const {email,password} = req.body
    // 1. 이메일 있나 체크
    const user = await userModel.findOne({email})
    // 목적에맞게 findOne을 쓰자 find는 배열로담아오고 findOne는 find[0]같은거니까
    if(!user){
        return res.status(400).render('login',{pageTitle,errMsg:"not found user"})
    }
    // 2. 비번 맞나 체크
    const matchPassword = await bcrypt.compare(password,user.password)
    // compare( input , result hash input) (입력값,해쉬함수거친 출력값) -> 이 두개가 맞는건지 확인하는 메서드인듯
    // 아까 bcrypt.hash쓸때처럼 콜백을받는데 promise와 async를 지원하니까 await을 쓴모습
    // await을 꼭써야한다. 아니면 비동기동작으로 바로 아래코드가 실행될거고 redirect가 될거니까
    // bcrypt의 공식문서를 봐보자 
    if(!matchPassword){
        return res.status(400).render('login',{pageTitle,errMsg:"password not correct"})
    }
    return res.redirect('/')
    /*
    있다면 user의 비번을 가져와서
    req.body를 똑같은 해쉬값으로 돌린 값이랑 같으면 login시켜주면 될듯
    */

    console.log(req.body)
}
export function profile(req,res){
    return res.send(`user -> profile`)
}
export function edit(req,res){
    return res.send('user -> edit')
}
export function logout(req,res){
    return res.send(`user -> logout`)
}
export function remove(req,res){
    return res.send('user -> delete')
}