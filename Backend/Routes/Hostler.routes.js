import express from "express";
import {
	addDetails,
	getHostler,
} from "../Controllers/hostlerAuth.controller.js";
import hostlerProtectRoute from "../Middlewares/Hostler.middleware.js";
import { getNotices, getPrivateGrievances, getPublicGrievances, privateGrievance, publicgrivance, upvote } from "../Controllers/hostler.controller.js";
import { getMessMenu } from "../Controllers/messmenu.controller.js";

const router = express.Router();

router.get("/getdetails", hostlerProtectRoute, getHostler);
router.post("/adddetails", hostlerProtectRoute, addDetails);

router.get('/getnotices', getNotices);
router.get('/getmessmenu', getMessMenu);

router.post("/publicgrievance", hostlerProtectRoute, publicgrivance);
router.get("/publicgrievance/upvote/:id", hostlerProtectRoute, upvote);

router.post("/privategrievance",hostlerProtectRoute, privateGrievance);

router.get('/getpublicgrievance', getPublicGrievances);
router.get('/getprivategrievance', hostlerProtectRoute, getPrivateGrievances);

export default router;
