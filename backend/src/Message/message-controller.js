const messageService = require('./message-service');

class MessageController {
    async getMessages(req, res, next) {
        try {
            const { conversationId } = req.params;
            const userId = req.user.id;
            const { page = 1, limit = 50 } = req.query;

            const messages = await messageService.getMessages(conversationId, userId, parseInt(page), parseInt(limit));
            res.json(messages);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new MessageController();