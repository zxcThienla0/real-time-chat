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

    async sendMessage(userId, conversationId, content, messageType = 'text', fileUrl = null) {
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

        const message = await Message.create({
            content,
            messageType,
            fileUrl,
            senderId: userId,
            conversationId
        });

        await conversationService.updateLastMessage(conversationId, content);

        const messageWithSender = await Message.findByPk(message.id, {
            include: [
                {
                    model: User,
                    as: 'sender',
                    attributes: ['id', 'nickname', 'avatar']
                }
            ]
        });

        return messageWithSender;
    }

    async editMessage(messageId, userId, newContent) {
        const message = await Message.findOne({
            where: {
                id: messageId,
                senderId: userId,
                isDeleted: false
            }
        });

        if (!message) {
            throw new Error('Сообщение не найдено или доступ запрещен');
        }

        await message.update({
            content: newContent,
            isEdited: true
        });

        await conversationService.updateLastMessage(message.conversationId, newContent);

        return await Message.findByPk(message.id, {
            include: [
                {
                    model: User,
                    as: 'sender',
                    attributes: ['id', 'nickname', 'avatar']
                }
            ]
        });
    }

    async deleteMessage(messageId, userId) {
        const message = await Message.findOne({
            where: {
                id: messageId,
                senderId: userId,
                isDeleted: false
            }
        });

        if (!message) {
            throw new Error('Сообщение не найдено или доступ запрещен');
        }

        await message.update({
            isDeleted: true,
            content: 'Сообщение удалено'
        });
    }
}

module.exports = new MessageService();