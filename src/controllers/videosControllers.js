import videoModel from "../models/Video"

const fakeUser = {
    userName:'kim',
    login:true
}

export async function homepage(req,res){
    try{
        const videos = await videoModel.find({})
        // 다시 말하지만 await이 해당 collection에서 데이터를 찾는걸 완료시까지
        // 기다려주니까 가능한 순서의 코드블럭이다
        return res.render("home",{
            pageTitle:"home",
            user:fakeUser,
            videos
        })
    }catch(err){
        console.log(err._message)
        return res.send(err)
    }
}

export async function getEdit(req,res){
    const {id} = req.params;
    const video = await videoModel.findById(id)
    return res.render('edit',{
        pageTitle:video.title,
        video
    })
}

export async function postEdit(req,res){
    try{
        const { id } = req.params;
        const video = await videoModel.findById(id)
        // 생각해보자 video document가 필요한가? -> 업데이터역시 id에맞는 부분을 가져오고 업데이트하는
        // find + update인 findByIdAndUpdate가 있다
        const {title, description, hashTags} = req.body;
        
        // 잊지말자. new Model도 결국 promise를 리턴했었다. 그래서 콜백으로 res를 해줬었고,
        // 마찬가지다 create도 promise를 리턴했기때문에 await으로 안정적인 response를 해줬고
        // findByUpdate도 마찬가지. 잊지말자

        /*
        중요한건 mongoose도 미들웨어 훅 등 이있다. 이말은 mongoose로 db를 조작하는것이 완성되기 전에
        미들웨어라면 그전에 조작하는 뭔가를 추가할수 있다는거지. 
        */
        await videoModel.findByIdAndUpdate(id,{
            title
            ,description,
            hashTags:hashTags.split(',').map(word => word[0]==='#' ? word : `#${word}`)
        })
        /*
        우리가 new Model해서 나온 document를 save()하는 거를 create()하나로 퉁치면 편하듯이
        마찬가지로 원래는 findById로 불러온 document(video)를 video.title = form의 title
        이런식으로 데이터를 바까주고 save()햇어야하는게 이렇게 편해진거다
        당연하겠지만 공식문서를 봐야하고. findByIdAndUpdate메서드는 1번째인자로 바꿀 document의 id를 받고
        2번째 인자로는 업데이트할 부분을 객체로 적어준다.
        */

        return res.redirect(`/videos/${id}`);

    }catch(err){
        console.log(`not found video`)
        return res.sed(err)
    }
}

export function search(req,res){
    return res.send('videos -> search')
}
export async function watch(req,res){
    const {id} = req.params;
    try{
        const video = await videoModel.findById(id)
        // video가 없으면 catch쪽으로 잘 넘어가네
        return res.render("watch",{
            pageTitle:video.title,
            video
        })
    }catch(err){
        console.log(`not fount video`)
        return res.send(err)
        // 추후 에러페이지 이런거는 알아서 만들기로하자
        // 따로 템플릿을 만들어서 페이지를 만들어주던지
    }
}
export function remove(req,res){
    return res.send(`videos -> remove`)
}

export function getUpload(req,res){
    return res.render("upload",{
        pageTitle:'Upload Video'
    })
}
export async function postUpload(req,res){
    const {title,description,hashTags} = req.body
    try{
        await videoModel.create({
            title,
            description,
            hashTags
            // hashTags.split(',').map(word => `#${word}`),
            // 원래는 위에를 hashTags로 변환해서 저장하는데 그걸 몽구스 미들웨어단에서 해서 저장하는형식으로하면
            // 좀더 cool한 방법이겠지? => Video.js에서 미들웨어부분(pre)참조
        })
        return res.redirect('/')
    }catch(err){
        console.log(err._message)
        return res.send(err)
    }
}

