export function homepage(req,res){
    return res.send('homepage -> show videos')
}
export function edit(req,res){
    console.log(req.params)
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
    return res.send(`videos -> watch #${req.params.id}`)
}
export function remove(req,res){
    console.log(req.params)
    return res.send(`videos -> remove`)
}
export function upload(req,res){
    console.log(req.params)
    return res.send(`videos -> upload`)
}