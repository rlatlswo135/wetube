import videoModel,{formatHashTags} from "../models/Video"

export async function homepage(req,res){
    try{
        const videos = await videoModel.find({}).sort({createAt:"desc"})
        return res.render("home",{
            pageTitle:"home",
            videos
        })
    }catch(err){
        console.log('err',err._message)
        return res.send(err)
    }
}

export async function getEdit(req,res){
    const {id} = req.params;
    const video = await videoModel.findById(id)
    if(!video){
        return res.status(404).render('edit',{pageTitle:"Video not found"})
    }
    // 일단 받아오는 video가 없으면 catch로 넘어가긴 하는거같은데.. -> 아닌걸 아래에서 찾아냄
    return res.render('edit',{
        pageTitle:video.title,
        video
    })
}

export async function postEdit(req,res){
        const { id } = req.params;
        const video = await videoModel.findById(id)
        if(!video){
            return res.status(404).render('edit',{pageTitle:'not found Video'})
        }
        const {title, description, hashTags} = req.body;
        /*
        중요한건 mongoose도 미들웨어 훅 등 이있다. 이말은 mongoose로 db를 조작하는것이 완성되기 전에
        미들웨어라면 그전에 조작하는 뭔가를 추가할수 있다는거지. 
        */
        await videoModel.findByIdAndUpdate(id,{
            title
            ,description,
            hashTags:formatHashTags(hashTags)
        })
        return res.redirect(`/videos/${id}`);
        // 일단 findById로 찾은 video가 없으면 catch로 넘어오긴 한다.
}

export async function getSearch(req,res){
    const {title} = req.query
    if(title){
        const regexp = new RegExp(title,'gi')
        const videos = await videoModel.find({title:regexp})
        /*
        몽고디비의 강력한 오퍼레이터기능이 있기때문에 가능한거고 원래는
        find({
            title:{
                &regex:reg (new RegExp(pattern))
            }
        })
        */
        return res.render('search',{pageTitle:'Search',videos})
    }
    return res.render('search',{pageTitle:'Search',videos:[]})
}
export function postSearch(req,res){
    // 아직 search 템플릿이 없다(퍼그)
}
export async function watch(req,res){
    const {id} = req.params;
    // try{
        const video = await videoModel.findById(id)
        if(!video){
            return res.status(404).send('not found video')
        }
        /*
        video가 없으면 catch쪽으로 잘 넘어가네
        -> 그게아니다 catch로 넘어가는거라면 아래 render를 리턴하는걸 지워도 video가 비어있으니 catch의 send로 넘어가서
        무한로딩이 뜨면안되는데 뜨는걸보면 find한 데이터가 비어있다고 catch로 넘어가는건 아닌듯.
        -> 맞네 video는 빈배열인데 video.title을 보내니까 여기서 에러가나서 catch로 넘어가는듯.

        => try catch지운다 이유를 알았으니

        어쨋든 await을 쓰는이상 try catch로 에러를 알아내긴 해야하니 쓰긴해야할듯
        */
        return res.render("watch",{
            pageTitle:video.title,
            video
        })
    // }catch(err){
        // console.log(`not fount video`)
        // return res.send(err)
    // }
}
export async function getDelete(req,res){
    const {id} = req.params
    console.log('id',id)
    await videoModel.findByIdAndDelete(id)
    return res.redirect('/')
}

export function getUpload(req,res){
    return res.render("upload",{
        pageTitle:'Upload Video'
    })
}
export async function postUpload(req,res){
    const {title,description,hashTags} = req.body
    try{
        /*
        model.create같은 메서드들을 우리들도 만들수있다 뜬금없지만
        static메서드는 클래스를 인스턴스화 하지않고도 클래스 안에서 호출될수 있는 메서드다
        schema.static(funName,()=>{
            return this.find({name})
        })
        이런식으로 나만의 스태틱메서드를 만드는거다 그래서 키워드도 static인가?

        -> 공식문서 보면 해당 스키마에서 컴파일된 모델에 -> 정적'클래스'메서드를 추가한다
        즉 스키마.static이자너? 그 스태틱으로 인해 생성된 모델 녀석들은 내가 입맛대로 생성한
        funName메서드를 가지고있을건데 개내들은 스태틱클래스 메서드라는거지(정적클래스메서드)
        */

        /*
        결국 .create findById이런애들은 다 query middleware다 => 아닌것같다.
        =>ㅇㅇ 확실히아님 '미들웨어'니까 스키마.pre함수에 적히는 1번째인자에 들어갈거고

        그 this가 뭔지는 내가확인해보자
        쿼리미들웨어는 내가 mongoose.model() 이나 db.model()를 할때 같이 컴파일 된다
        (같이 기능적으로 껴진다는소리같은데)
        근데 그 쿼리미들웨어중에 update나 findOneAndUpdate에서는
        save()훅이 실행되지 않을거라는데? -> 그러면 save()훅을안쓰는 async방법을 써야혀?
        */
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

