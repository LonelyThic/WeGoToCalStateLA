import { Router } from 'express';
import passport from 'passport';

const router = Router();

router.get(
  '/me',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({
      userId: req.user.userId,
      email: req.user.email,
      username: req.user.username,
    });
  }
);

export default router;
