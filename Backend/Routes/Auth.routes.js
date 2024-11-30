import express from 'express';
import { wardenLogin, wardenLogout, wardenRegisteration } from '../Controllers/wardenAuth.controller.js';
import { hostlerlogin, hostlerlogout,} from '../Controllers/hostlerAuth.controller.js';

const router = express.Router();

// Warden Routes
router.post('/wardenregistration', wardenRegisteration);
router.post('/wardenlogin', wardenLogin);
router.post('/wardenlogout', wardenLogout);

// Hostlers Routes
// router.post('/warden/hostlerregistration',wardenProtectRoute ,hostlerregistration);
router.post('/hostlerlogin', hostlerlogin);
router.post('/hostlerlogout', hostlerlogout);

export default router;