import express from "express";
import {
	addDetails,
	getHostler,
} from "../Controllers/hostlerAuth.controller.js";
import hostlerProtectRoute from "../Middlewares/Hostler.middleware.js";
import {
	applyLeave,
	closeEntry,
	getEntry,
	getLeaves,
	getNotices,
	getPrivateGrievances,
	getPublicGrievances,
	markAttendence,
	openEntry,
	privateGrievance,
	publicgrivance,
	setPass,
	upvote,
} from "../Controllers/hostler.controller.js";
import { getMessMenu } from "../Controllers/messmenu.controller.js";

const router = express.Router();

router.post("/setpass", hostlerProtectRoute, setPass);

router.get("/getdetails", hostlerProtectRoute, getHostler);
router.post("/adddetails", hostlerProtectRoute, addDetails);

router.get("/getnotices", getNotices);
router.get("/getmessmenu", getMessMenu);

router.post("/publicgrievance", hostlerProtectRoute, publicgrivance);
router.get("/publicgrievance/upvote/:id", hostlerProtectRoute, upvote);

router.post("/privategrievance", hostlerProtectRoute, privateGrievance);

router.get("/markattendance", hostlerProtectRoute, markAttendence);

router.get("/getpublicgrievance", getPublicGrievances);
router.get("/getprivategrievance", hostlerProtectRoute, getPrivateGrievances);

router.post("/applyleave", hostlerProtectRoute, applyLeave);
router.get("/getleaves", hostlerProtectRoute, getLeaves);

router.post("/openentry", hostlerProtectRoute, openEntry);
router.get("/closeentry", hostlerProtectRoute, closeEntry);
router.get("/getentry", hostlerProtectRoute, getEntry);

export default router;
