export function join(req,res){
    return res.send('user -> join controller')
}
export function login(req,res){
    return res.send(`user -> login`)
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