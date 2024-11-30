import express from "express";
import {
	addHostler,
	gethostler,
	getHostlers,
	getLeaves,
	getOutRegister,
	getPrivateGrievances,
	getPublicGrievances,
	setLeaves,
	setPrivateGrievance,
	setPublicGrievance,
	updateRoom,
} from "../Controllers/warden.controller.js";
import wardenProtectRoute from "../Middlewares/Warden.middleware.js";
import { getWarden } from "../Controllers/wardenAuth.controller.js";
import { uploadNotice } from "../Controllers/notice.controller.js";
import { uploadMessMenu } from "../Controllers/messmenu.controller.js";

const router = express.Router();

router.post("/addhostler", wardenProtectRoute, addHostler);
router.get("/getdetails", wardenProtectRoute, getWarden);

router.get("/gethostlers", wardenProtectRoute, getHostlers);
router.get("/getdetail/:id", wardenProtectRoute, gethostler);

router.post("/setroom/:id", wardenProtectRoute, updateRoom);

router.get("/getpublicgrievance", wardenProtectRoute, getPublicGrievances);
router.get("/getprivategrievance", wardenProtectRoute, getPrivateGrievances);

router.post("/setpublicgrievance/:id", wardenProtectRoute, setPublicGrievance);
router.post(
	"/setprivategrievance/:id",
	wardenProtectRoute,
	setPrivateGrievance
);

router.post("/uploadnotice", wardenProtectRoute, uploadNotice);

router.post("/uploadmessmenu", wardenProtectRoute, uploadMessMenu);

router.get("/getleaves", wardenProtectRoute, getLeaves);
router.post("/setleave/:id", wardenProtectRoute, setLeaves);

router.get("/getentries", wardenProtectRoute, getOutRegister);

export default router;
