import express from "express";
import {
	addHostler,
	changeIP,
	getAttendance,
	gethostler,
	getHostlers,
	getLeaves,
	getOutRegister,
	getPrivateGrievances,
	getPublicGrievances,
	markAttendence,
	removeHostler,
	setLeaves,
	setPrivateGrievance,
	setPublicGrievance,
	updateRoom,
} from "../Controllers/warden.controller.js";
import wardenProtectRoute from "../Middlewares/Warden.middleware.js";
import { forgetPass, getWarden, resetPass } from "../Controllers/wardenAuth.controller.js";
import { getNotice, getNotices, uploadNotice } from "../Controllers/notice.controller.js";
import { getMessMenu, uploadMessMenu} from "../Controllers/messmenu.controller.js";

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

router.post("/uploadnotice", wardenProtectRoute ,uploadNotice);

router.post("/uploadmessmenu", wardenProtectRoute, uploadMessMenu);

router.get("/getleaves", wardenProtectRoute, getLeaves);
router.post("/setleave/:id", wardenProtectRoute, setLeaves);

router.get("/getentries", wardenProtectRoute, getOutRegister);

router.get("/removehostler/:id",wardenProtectRoute, removeHostler);

router.post("/markattendance", wardenProtectRoute, markAttendence);

router.post("/attendanceof", wardenProtectRoute, getAttendance);

router.get("/getmessmenu", getMessMenu);
router.get("/getnotices", wardenProtectRoute, getNotices);
router.get("/getnotice/:id",  getNotice);

router.post('/changeip', wardenProtectRoute, changeIP);
router.post('/forgetpass', forgetPass);
router.post('/resetpass', wardenProtectRoute, resetPass);

export default router;
