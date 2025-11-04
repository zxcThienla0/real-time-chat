const Router = require('express');
const router = new Router();
const messageController = require('./message-controller');
const authMiddleware = require('../middleware/auth-middleware');

router.use(authMiddleware);

router.get('/:conversationId', messageController.getMessages);
router.post('/', messageController.sendMessage);
router.put('/:id', messageController.editMessage);
router.delete('/:id', messageController.deleteMessage);


module.exports = router;
