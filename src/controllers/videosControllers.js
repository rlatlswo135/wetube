import videoModel from "../models/Video"

const fakeUser = {
    userName:'kim',
    login:true
}

export async function homepage(req,res){
    // model의 find메서드는 사용법이 2가지다, promise / callback 방식. 
    // 생각해보면 app.listen도 리스닝상태가되면 콜백을 실행시키고.. fetch든 뭐던 다 그러네..
    // 이것도 db에서 filter(1번째인자)에 해당되는 데이터를 찾으면 그러면(then) 그때 2번째 콜백을 실행할거다.
    videoModel.find({},(err,find)=>{
        console.log('error',err)
        // 개쩌는 console.log (key:value형태로 보여줌)
        console.log('result',find)
    })
    console.log('순서')
    // 순서를 잘보자 js동잒때문에 '순서'가먼저 -> res.render가 그다음(미들웨어가 실행되는걸 보면 알수있음) -> 그다음  큐에서돌아온녀석(err,result)가보일거다
    return res.render("home",{
        pageTitle:"home",
        user:fakeUser,
    })
}
export function getEdit(req,res){
    const {id} = req.params;
    return res.render('edit',{
        pageTitle:`edit video title -> ${video.title}`,
    })
}
export function search(req,res){
    return res.send('videos -> search')
}
export function watch(req,res){
    const {id} = req.params;
    return res.render("watch",{
        id:req.params.id,
        pageTitle:`Watch ${video.title}`,
    })
}
export function remove(req,res){
    return res.send(`videos -> remove`)
}

export function getUpload(req,res){
    return res.render("upload",{
        pageTitle:'upload'
    })
}
export function postUpload(req,res){
    console.log(req.body)
    return res.redirect('/')
}

export function postEdit(req,res){
    const { id } = req.params
    // console.log(req.get('content-type'))
    return res.redirect(`/videos/${id}`)
}