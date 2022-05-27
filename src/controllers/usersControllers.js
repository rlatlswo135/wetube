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
        // 몽고디비가 지원하는 $or 오퍼레이터
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
    if(!matchPassword){
        return res.status(400).render('login',{pageTitle,errMsg:"password not correct"})
    }
    console.log('req.session',req.session)
    req.session.isLogin = true;
    req.session.user = user;

    //로그인시 세션데이터의 커스텀으로 isLogin,user를 담아줄거다
    return res.redirect('/')
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