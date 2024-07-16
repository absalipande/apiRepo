import express from 'express';
import { loginOrSignup, logout, verify } from '../controllers/authController.js';

const router = express.Router();

router.post('/login-or-signup', loginOrSignup);
router.post('/logout', logout);
router.get('/verify', verify);

export default router;
