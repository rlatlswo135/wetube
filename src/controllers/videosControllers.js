const fakeUser = {
    userName:'kim',
    login:true
}

export function homepage(req,res){
    const videos = [
        {
            title:"Video #1",
            rating:3,
            comments:50,
            createdAt:'2015-05-03',
            views:100
        },
        {
            title:"Video #2",
            rating:5,
            comments:100,
            createdAt:'2018-05-03',
            views:130
        },
        {
            title:'Video #3',
            rating:1,
            comments:10,
            createdAt:'2012-05-03',
            views:50
        }
    ]
    // const videos = []
    
    return res.render("home",{
        pageTitle:"home",
        user:fakeUser,
        videos
    })
    /*
    what is res.render? => express봐서 인자랑 다 보자
    컨트롤러가 home.pug를 렌더하고있자너?
    그럼 여기서 변수를 보내줘야겠지? => 2번째인자
    사용하는 render페이지에서 봐보자 -> home.pug겠지?
    => #{}안에 Js코드 쓰는데 그안에 변수로 들어가있는모습.
    */
}
export function edit(req,res){
    return res.send('videos -> edit')
}
export function search(req,res){
    return res.send('videos -> search')
}
export function watch(req,res){
    // const {id} = req.params;
    // const numExec = new RegExp('\\d+','gi')
    // const findNumber =id.match(numExec)
    // if(!findNumber){
    //     return res.send('video id is number')
    // }
    return res.render("watch",{
        id:req.params.id,
    })
}
export function remove(req,res){
    return res.send(`videos -> remove`)
}
export function upload(req,res){
    return res.send(`videos -> upload`)
}