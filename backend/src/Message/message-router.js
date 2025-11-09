const Router = require('express');
const router = new Router();
const messageController = require('./message-controller');
const authMiddleware = require('../middleware/auth-middleware');

router.use(authMiddleware);

router.get('/:conversationId', messageController.getMessages);


module.exports = router;
