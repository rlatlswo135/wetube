import userModel from '../models/User';
import bcrypt from "bcrypt"
import fetch from 'node-fetch'


export const getJoin = function(req,res){
    return res.render('join',{
        pageTitle:'회원 가입',
        errMsg:" "
    })
}
export const postJoin = async function(req,res){
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
export const getLogin = function(req,res){
    return res.render('login',{pageTitle:'login',errMsg:""})
}
export const postLogin = async function(req,res){
    const pageTitle = "login"
    const {email,password} = req.body
    // 1. 이메일 있나 체크
    const user = await userModel.findOne({email,socialLogin:false})
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
export const profile = function(req,res){
    return res.send(`user -> profile`)
}

export const getEdit = function(req,res){
    return res.render("edit-profile",{
        pageTitle:"Edit Profile",
        errMsg:""
    })
}

export const postEdit = async function(req,res){
    const {user:{_id,userName}} = req.session
    const {name,location} = req.body;
    console.log(`name`,name)
    console.log(`userName`,userName)

    const existUser = await userModel.findOne({userName:name})
    console.log(`exist`,existUser)
    // 써봤지만 업데이트된 값을 변수에 넣어주려면 3번째옵션에 new 프로퍼티를 써줘야한다

    //추가로 바꾸려는 닉네임의 중복여부도 체크해봐야할듯.
    if(existUser){
        return res.render("edit-profile",{
            pageTitle:"Edit Profile",
            errMsg:"exist username"
        })
    }
    const updatedUser = await userModel.findByIdAndUpdate(_id,{
        userName:name
        ,location
    },{
        new:true
    })
    //db의 데이터가 변경되었으니 변경된 내용을 가지고 session.user도 업데이트가 되야한다
    /*
    or 변수에 담지않고 그냥 await userModel 해서 update한 후
    req.session.user = { ...req.session.user , name,locion }으로
    직접 넣어줄수도
    */

    console.log(`updateuser`,updatedUser)
    req.session.user = updatedUser
    return res.redirect("/")
}


export const logout = function(req,res){
    console.log(req.session)
    // 세션에 우리 유저정보 + 로그인상태 + 세션아이디가 들어있으니 로그아웃시에는 이 세션데이터를 파괴해야한다
    // 세션은 연결단위니까 우리의 연결에서만 파괴될거
    req.session.destroy();
    return res.redirect('/')
}
export const remove = function(req,res){
    return res.send('user -> delete')
}

export const githubOAuth = function(req,res){
    //step 1
    const baseUrl = 'https://github.com/login/oauth/authorize'
    const queryRecord = {
        client_id : process.env.CLIENT_ID,
        scope:"read:user user:email"
        //github Docs에서 scope를 봐보자. 공백으로 구분하고 접근할수있는 정보를 서술한다
    }
    const query = new URLSearchParams(queryRecord).toString()
    // 하고 유저인증이 넘어가면 github에 세팅해준 redirect주소로 우리를 리다이렉트시킬꺼다
    return res.redirect(`${baseUrl}?${query}`)

    
}

export const finishGitHubOAuth = async function(req,res){
    // 요 baseUrl맨앞에 공백(띄워쓰기)가 있으니 현재경로 / 뒤에 https~ 이런식으로와서 에러나옴
    //step 2
    const baseUrl = 'https://github.com/login/oauth/access_token'
    const queryRecord = {
        code:req.query.code,
        client_id:process.env.CLIENT_ID,
        client_secret:process.env.CLIENT_SECRET
    }
    /*
    너무 어렵게생각했다. 엑세스토큰을 받기위해 클라이언트 id / secret / code를 이용해서
    토큰받는 url에 post요청을 보내야하는데; 이걸 너무 어렵게생각했네 -> fetch쓰면 되자너
    */
   const query = new URLSearchParams(queryRecord).toString()
   const finalUrl = `${baseUrl}?${query}`
   const data = await fetch(finalUrl,{
       method:"post",
       headers:{
        Accept:"application/json"
        //근데 default가 json아닐까? 그렇다면 구지 넣을필요없는녀석일텐데
       }
   })
//fetch자체가 프로미스를 리턴한다 그러니 프로미스ㅔ메서드인 then으로 체이닝하는거고
   const json = await data.json()


//step 3
   if("access_token" in json){
       const fetchUser = await fetch('https://api.github.com/user',{
           headers:{
            Authorization: `token ${json.access_token}`
           }
        //다 깃허브 공식에 나와있다
       })
       // 각 
       const user = await fetchUser.json()
       console.log(`githubUser`,user)
       // email을 깃허브에서 숨김으로 표시한경우 불러올수있다 (인증되있을경우 ) 근데난 안해놨네;
       if(!user.email){
           console.log('email없다')
           const fetchUserEmail = await fetch('https://api.github.com/user/emails',{
               headers:{
                   Accept:"application/vnd.github.v3+json",
                   Authorization: `token ${json.access_token}`
                //뭐든 인증된 녀석들한테만 보여준다했으니 엑세스토큰을 이용해야지 인증됬다는 걸 알릴수있으니까
                // 온갖 요청에는 이 인증 헤더에 엑세스토큰을 껴야한다 (github문서참조)
               }
           });
           const userEmail = await fetchUserEmail.json()
           const filterEmail = userEmail.find(mail => mail.primary && mail.verified === true)
        //    const filterEmail = userEmail.filter(mail => mail.primary && mail.verified === true)
        // 둘의 차이는 find는 찾은 배열의 원소를 , 필터는 찾은 원소를 배열에 담아서.
        if(!filterEmail){
            return res.redirect('/login')
        }
        user.email = filterEmail.email
        // 그후 인증된 이메일이 있나 찾은뒤에 그 이메일이 우리 db에 가입된 이메일인지를 본다 -> 있으면 그걸로 로그인시키면되니까
    }
    let findUser = await userModel.findOne({email:user.email});
    if(!findUser){
        // 없으면 그 이메일로 회원가입하라고 리다이렉트한다 (대부분의 사이트가 이런 방법을 취하는데 어떻게 로그인시킬건지 방법은 여러가지
        findUser = await userModel.create({
            userName:user.name||'UnKnown',
            // 만약 소셜로그인에 name이 나의 서비스의 어떤 user의 name과 겹친다면?
            // name은 unique로 되있어서 오류가나려나?
            email:user.email,
            password:" ",
            socialLogin:true,
            location:user.location,
            avater:user.avatar_url
        })
    }
        // 추후 고민은 소셜로그인하는애들은 password로 로그인시키면안된다
        // 별도의 소셜로그인 프로퍼티를 만들어뒀으니 password로그인시에는
        // 그 소셜로그인프로퍼티가 false인애들만 끍어서 그안에 있는애들로만 비밀번호를 검증해야할듯
        req.session.isLogin = true;
        req.session.user = findUser;
        return res.redirect('/')
   }else{
       return res.redirect('/login')
   }
}

export const getChangePassword = function(req,res){
    if(req.session.user.socialLogin){
        return res.redirect('/')
    }
    return res.render("change-password",{
        pageTitle:"Change Password"
    })
}

export const postChangePassword = async function(req,res){
    const {oldSecret,newSecret,newSecretConfirm} = req.body;
    const {user} = req.session;
    const pageTitle = "Change Password"

    const oldMatch = await bcrypt.compare(oldSecret,user.password)
    console.log(`oldMatch`,oldMatch)
    if(!oldMatch){
        return res.render("change-password",{
            pageTitle,
            errMsg:"old password가 같지 않습니다"
        })
    }
    if(oldSecret === newSecret){
        return res.render("change-password",{
            pageTitle,
            errMsg:"변경하려는 password가 전과 같습니다"
        })
    }
    if(newSecret !== newSecretConfirm){
        return res.render("change-password",{
            pageTitle,
            errMsg:"password Confirm이 다릅니다"
        })
    }

    // password가 해쉬로 저장되어야하고 + 로그인할때도 해쉬된 스트링을
    // compare해서 확인후 로그인하기때문에 필수임

    const currentUser = await userModel.findById(user._id);
    currentUser.password = newSecret;
    await currentUser.save();
    // save시까지 대기

    /*
    위 아래는 같다 대신. user스키마의 pre미들웨어에서 password를 해쉬값으로 바꿔주는
    로직이 짜여있기때문에 그걸 이용하기위해 쓴다 save()를 쓰면 pre미들웨어가 작동할테니까
    */

    // const newSecretHash = await bcrypt.hash(newSecret,5)
    // await userModel.findByIdAndUpdate(user._id,{
    //     password:newSecretHash
    // })

    req.session.destroy();

    return res.redirect('/')
}