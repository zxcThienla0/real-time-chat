const { Message, Conversation, User } = require('../models');
const conversationService = require('../Conversation/conversation-service');
const { Op } = require('sequelize');

class MessageService {
    async getMessages(conversationId, userId, page = 1, limit = 50) {
        const conversation = await Conversation.findOne({
            where: {
                id: conversationId,
                [Op.or]: [
                    { user1Id: userId },
                    { user2Id: userId }
                ]
            }
        });

        if (!conversation) {
            throw new Error('Диалог не найден или доступ запрещен');
        }

        const offset = (page - 1) * limit;

        return await Message.findAndCountAll({
            where: {
                conversationId,
                isDeleted: false
            },
            include: [
                {
                    model: User,
                    as: 'sender',
                    attributes: ['id', 'nickname', 'avatar']
                }
            ],
            order: [['createdAt', 'DESC']],
            limit,
            offset
        });
    }

}

module.exports = new MessageService();