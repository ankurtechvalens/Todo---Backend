import express from 'express'
import { registerUser, loginUser, updateUser, getProfile, refreshTokenController, logoutUser, changePlan } from '../controllers/user.controllers.js';
import authMiddleware from "../middleware/auth.js";
import { validate } from '../middleware/validate.js';
import {registerSchema , loginSchema} from '../validators/user.validators.js'
const router = express.Router();

router.post('/register',validate(registerSchema), registerUser);
router.post('/login',validate(loginSchema), loginUser);
router.post("/logout",authMiddleware, logoutUser);
router.put("/update", authMiddleware, updateUser);
router.get('/profile', authMiddleware, getProfile)
router.post("/refresh", refreshTokenController);
router.put("/plan", authMiddleware, changePlan);
// userRouter.delete('/delete/:id', authMiddleware, userDelete);

router.get('/', (req, res) => {
  res.send('User route');
});

export default router;