import express from 'express'
import { watch,edit,remove,upload } from '../controllers/videosControllers';
const videosRouter = express.Router('/videos');

videosRouter.get('/upload',upload);
videosRouter.get('/:id(\\d+)',watch);
videosRouter.get('/:id(\\d+)/edit',edit);
videosRouter.get(':id(\\d+)/delete',remove);


export default videosRouter