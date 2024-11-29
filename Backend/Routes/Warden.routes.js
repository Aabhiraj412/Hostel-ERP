import express from 'express';
import { gethostler, getHostlers, getPrivateGrievances, getPublicGrievances, setPrivateGrievance, setPublicGrievance, updateRoom } from '../Controllers/warden.controller.js';
import wardenProtectRoute from '../Middlewares/Warden.middleware.js';
import hostlerProtectRoute from '../Middlewares/Hostler.middleware.js';
import { getWarden } from '../Controllers/wardenAuth.controller.js';
import { uploadNotice } from '../Controllers/notice.controller.js';
import { uploadMessMenu } from '../Controllers/messmenu.controller.js';

const router = express.Router();

router.get('/getdetails', wardenProtectRoute, getWarden);

router.get('/gethostlers', wardenProtectRoute ,getHostlers);
router.get('/getdetail/:id',wardenProtectRoute ,gethostler);

router.post('/setroom/:id', wardenProtectRoute ,updateRoom);

router.get('/getpublicgrievance', wardenProtectRoute, getPublicGrievances);
router.get('/getprivategrievance', wardenProtectRoute, getPrivateGrievances);

router.post('/setpublicgrievance/:id', wardenProtectRoute, setPublicGrievance);
router.post('/setprivategrievance/:id', wardenProtectRoute, setPrivateGrievance);

router.post('/uploadnotice', wardenProtectRoute, uploadNotice);

router.post('/uploadmessmenu', wardenProtectRoute, uploadMessMenu);

export default router;