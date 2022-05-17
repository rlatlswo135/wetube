import express from 'express'
import { watch,getEdit,remove,getUpload,postEdit,postUpload } from '../controllers/videosControllers';
const videosRouter = express.Router('/videos');

videosRouter.get('/:id(\\d+)',watch);
videosRouter.get(':id(\\d+)/delete',remove);

videosRouter.route('/:id(\\d+)/edit')
.get(getEdit)
.post(postEdit)

videosRouter.route('/upload')
.get(getUpload)
.post(postUpload)

// videosRouter.get('/:id(\\d+)/edit',getEdit);
// videosRouter.post('/:id(\\d+)/edit',postEdit)


export default videosRouter