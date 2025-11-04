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

    async sendMessage(req, res, next) {
        try {
            const userId = req.user.id;
            const { conversationId, content, messageType = 'text', fileUrl = null } = req.body;

            const message = await messageService.sendMessage(userId, conversationId, content, messageType, fileUrl);
            res.status(201).json(message);
        } catch (error) {
            next(error);
        }
    }

    async editMessage(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const { content } = req.body;

            const message = await messageService.editMessage(id, userId, content);
            res.json(message);
        } catch (error) {
            next(error);
        }
    }

    async deleteMessage(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            await messageService.deleteMessage(id, userId);
            res.json({ message: 'Сообщение удалено' });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new MessageController();