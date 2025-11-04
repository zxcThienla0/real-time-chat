const Router = require('express');
const router = new Router();
const conversationController = require('./conversation-controller');
const authMiddleware = require('../middleware/auth-middleware');

router.use(authMiddleware);

router.get('/', conversationController.getUserConversations);
router.get('/:id', conversationController.getConversationById);
router.post('/', conversationController.createOrGetConversation);
router.get('/with/:nickname', conversationController.getConversationWithUser);
router.delete('/:id', conversationController.deleteConversation);

module.exports = router;