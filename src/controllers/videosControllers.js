import videoModel from "../models/Video"

const fakeUser = {
    userName:'kim',
    login:true
}

export async function homepage(req,res){
    // model의 find메서드는 사용법이 2가지다, promise / callback 방식. 
    // 생각해보면 app.listen도 리스닝상태가되면 콜백을 실행시키고.. fetch든 뭐던 다 그러네..
    // 이것도 db에서 filter(1번째인자)에 해당되는 데이터를 찾으면 그러면(then) 그때 2번째 콜백을 실행할거다.
    // 첫번째가 필터링의 조건이고 2번째인자가 찾으면 실행할 콜백인데. -> 프로미스로 쓴다고하면 프로미스안에 videoModel.find({})넣어주면 resolve로 뱉어주면 될려나?

    // videoModel.find({},(err,find)=>{
    //     console.log('error',err)
        // 개쩌는 console.log (key:value형태로 보여줌)
    //     console.log('result',find)
    //     return res.send('aa')
        // 아래의 res.end()가 먼저일까 res.send()가 먼저일까? => res.end()가 먼저일거다 왜냐면.
        // 지금 find메서드안에 콜백으로 err,find를 인자로 받은 함수가 들어가있고 그 콜백함수안에서 return res.send다 그러니 js에서 비동기처리로 될거고
        // 콜스택이 비어있어야지 태스크큐에서 올라오기때문에 res.end()가 먼저될거다. 그럼 return 이 났으니까 homepage함수는 더 기능을 수행하지 않을거고
        // 결국 res.end()가 해버린뛰에. 태스크큐에있던 model.find()함수에 콜백함수가 콜스택에 들어올거고 res.send를 할건데. 이미 res.end()(연결끊음)을 했는데 send를 했으니
        // 오류가 날것이다.
    // })
    // return res.end();

    // console.log('순서')
    // 순서를 잘보자 js동잒때문에 '순서'가먼저 -> res.render가 그다음(미들웨어가 실행되는걸 보면 알수있음) -> 그다음  큐에서돌아온녀석(err,result)가보일거다

    // const videos = new Promise((resolve,reject) => {
    //     return resolve(videoModel.find({}))
    // }).then(value => console.log(value))

    //비동기 함수가 아닌 promise로하면 위와같은 형태가 아닐까 싶다..
    try{
        const videos = await videoModel.find({})
        return res.render("home",{
            pageTitle:"home",
            user:fakeUser,
            videos
        })
        // response메서드를 return하는건 문제가안된다. 호출만해도 정삭적으로 렌더가 될테지만 리턴을하는이유는
        // 역시 response를 하고 해당 함수를 종료하기 위함일테다. -> 성능개선에도 영향이있을까?
    }catch(err){
        console.log(err)
        return res.send(err)
    }

    // 그래서 res.render를 model.find메서드 콜백안에 넣으면 될텐데. 그럼 콜백안에 또 함수가생기고.. 또 비동기가 필요하다면
    // 또 그래야하고 할거다.. 그래서 async / promise를 쓰나?
    // 하지만 콜백의 장점은 err케이스를 바로 뽑아낼수있다는거지.
}
export async function getEdit(req,res){
    const {id} = req.params;
    const videos = await videoModel.find({})
    return res.render('edit',{
        pageTitle:`edit video`,
    })
}
export function search(req,res){
    return res.send('videos -> search')
}
export function watch(req,res){
    const {id} = req.params;
    return res.render("watch",{
        id:req.params.id,
        pageTitle:`Watch video`,
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