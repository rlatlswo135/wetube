import express from 'express'
import { watch,edit,remove,upload } from '../controllers/videosControllers';
const videosRouter = express.Router('/videos');

//
videosRouter.get('/upload',upload);
/*
별거아니어 보이지만 중요한부분.
url params로 id로 라우팅하는 부분이있고 upload라우팅 부분이있다
만약 /:id가 /upload보다 위에있다면.
/:id 즉 id가 'upload'로 받아서 watch컨트롤러가 실행될거다.

마치 react-router-dom에서 그 순서문제때문에 exec속성 쓰는거랑 비슷한이치지.
익스프레스가 위에서부터 쭉보고 음 upload라우팅이 :id저부분이구나 해서 들어가는거지(id가 upload보다 위에있으면)
[익스프레스 입장에서는 /:id 나 /upload나 똑같으니까]
*/
//
videosRouter.get('/:id(\\d+)',watch);
// 이렇게도 가능한데 정규식에 있는부분인가 싶기도하다.
// ()안에 정규식을써서 id가 정규식에 match되는지를 보는듯?
//그래서 id가 \d+ 에 통과한다면 watch컨트롤러를 실행하겠지
//그니까 결국 /(\\d+)인거지 근데 저게 :id로 뭉그러진거고 대충 느낌은온다.
videosRouter.get('/:id(\\d+)/edit',edit);
videosRouter.get(':id(\\d+)/delete',remove);


export default videosRouter