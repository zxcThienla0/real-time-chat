const Router = require('express')
const UserController = require('./user-controller')
const router = new Router()
const authMiddleware =require('./../middleware/auth-middleware')

router.post('/login', UserController.login)
router.post('/registration', UserController.registration)
router.post('/logout', UserController.logout)
router.get('/refresh', UserController.refresh)
router.get('/profile', authMiddleware, UserController.getProfile);

module.exports = router