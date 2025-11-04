const conversationService = require('./conversation-service');

class ConversationController {
    async getUserConversations(req, res, next) {
        try {
            const userId = req.user.id;
            const conversations = await conversationService.getUserConversations(userId);
            res.json(conversations);
        } catch (error) {
            next(error);
        }
    }

    async getConversationById(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const conversation = await conversationService.getConversationById(id, userId);
            res.json(conversation);
        } catch (error) {
            next(error);
        }
    }

    async createOrGetConversation(req, res, next) {
        try {
            const userId = req.user.id;
            const { partnerNickname } = req.body;

            const conversation = await conversationService.createOrGetConversation(userId, partnerNickname);
            res.json(conversation);
        } catch (error) {
            next(error);
        }
    }

    async getConversationWithUser(req, res, next) {
        try {
            const userId = req.user.id;
            const { nickname } = req.params;

            const conversation = await conversationService.getConversationWithUser(userId, nickname);
            res.json(conversation);
        } catch (error) {
            next(error);
        }
    }

    async deleteConversation(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            await conversationService.deleteConversation(id, userId);
            res.json({ message: 'Диалог удален' });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ConversationController();