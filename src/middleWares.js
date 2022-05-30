export const localsMiddleWare = function(req,res,next){
    const {isLogin,user} = req.session
    // login시 postLogin쪽에서 req.session에 isLogin으로 넣어준다
    res.locals.isLogin = Boolean(isLogin)
    // 템플릿엔진에서 접근가능한 데이터셋인 locals에 세션데이터를 넣어준모습
    if(isLogin){
        res.locals.user = user;
    }

    next();
}

// 로그인상태일때만 다음 요청을 진행할수있게 아니면 로그인으로 리다이렉트
export const protectorMiddleWare = function(req,res,next){
    if(req.session.isLogin){
        next();
    }else{
        return res.redirect("/login")
    }
}

// 로그인 아닌상태만 다음 요청 진행할수있게 아니면 홈으로 리다이렉트
export const publicOnlyMiddleWare = function(req,res,next){
    if(!req.session.isLogin){
        return next();
    }else{
        return res.redirect("/")
    }
}