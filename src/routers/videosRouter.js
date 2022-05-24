import express from 'express'
import {
    watch,
    getEdit,
    getDelete,
    getUpload,
    postEdit,
    postUpload,
    deleteVideo
 } from '../controllers/videosControllers';
const videosRouter = express.Router('/videos');

videosRouter.get('/:id([0-9,a-f]{24})',watch);
videosRouter.get('/:id([0-9,a-f]{24})/delete',getDelete);

// mongoDB쪽에서 생성되는 id가 24자리의 16진수랜덤데이터란다.
// 16진수가 0~9 + a~f까지니까 이렇게 해준거.
videosRouter.route('/:id([0-9,a-f]{24})/edit')
.get(getEdit)
.post(postEdit)

// route를 쓰는문법 -> express한번 봐보긴 해야할듯
videosRouter.route('/upload')
.get(getUpload)
.post(postUpload)

// 어쨋든 아래의 코드를 깔끔하게 해준다.
// videosRouter.get('/:id(\\d+)/edit',getEdit);
// videosRouter.post('/:id(\\d+)/edit',postEdit)



export default videosRouter