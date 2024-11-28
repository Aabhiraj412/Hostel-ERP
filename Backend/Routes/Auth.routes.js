import express from 'express';
import { wardenLogin, wardenLogout, wardenRegisteration } from '../Controllers/warden.controller.js';
import { addDetails, hostlerlogin, hostlerlogout, hostlerregistration } from '../Controllers/hostler.controller.js';
import wardenProtectRoute from '../Middlewares/Warden.middleware.js';
import hostlerProtectRoute from '../Middlewares/Hostler.middleware.js';

const router = express.Router();

// Warden Routes
router.post('/wardenregistration', wardenRegisteration);
router.post('/wardenlogin', wardenLogin);
router.post('/wardenlogout', wardenLogout);

// Hostlers Routes
router.post('/warden/hostlerregistration',wardenProtectRoute ,hostlerregistration);
router.post('/hostlerlogin', hostlerlogin);
router.post('/hostlerlogout', hostlerlogout);

router.post('/hostler/adddetails', hostlerProtectRoute, addDetails);

export default router;