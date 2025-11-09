const Router = require('express')
const UserController = require('./user-controller')
const authMiddleware =require('./../middleware/auth-middleware')
const { uploadFile, handleFileUpload } = require('./../Message/uploadController');
const router = new Router()

router.post('/login', UserController.login)
router.post('/registration', UserController.registration)
router.post('/logout', UserController.logout)
router.get('/refresh', UserController.refresh)
router.get('/profile', authMiddleware, UserController.getProfile);
router.post('/upload', authMiddleware, uploadFile, handleFileUpload);

module.exports = router