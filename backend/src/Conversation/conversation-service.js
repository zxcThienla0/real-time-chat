const { Conversation, User, Message } = require('../models');
const { Op } = require('sequelize');

class ConversationService {
    async getUserConversations(userId) {
        return await Conversation.findAll({
            where: {
                [Op.or]: [
                    { user1Id: userId },
                    { user2Id: userId }
                ]
            },
            include: [
                {
                    model: User,
                    as: 'user1',
                    attributes: ['id', 'nickname', 'avatar']
                },
                {
                    model: User,
                    as: 'user2',
                    attributes: ['id', 'nickname', 'avatar']
                },
                {
                    model: Message,
                    limit: 1,
                    order: [['createdAt', 'DESC']],
                    attributes: ['content', 'createdAt', 'messageType']
                }
            ],
            order: [['lastMessageAt', 'DESC']]
        });
    }

    async getConversationById(conversationId, userId) {
        const conversation = await Conversation.findOne({
            where: {
                id: conversationId,
                [Op.or]: [
                    { user1Id: userId },
                    { user2Id: userId }
                ]
            },
            include: [
                {
                    model: User,
                    as: 'user1',
                    attributes: ['id', 'nickname', 'avatar']
                },
                {
                    model: User,
                    as: 'user2',
                    attributes: ['id', 'nickname', 'avatar']
                }
            ]
        });

        if (!conversation) {
            throw new Error('Диалог не найден');
        }

        return conversation;
    }

    async createOrGetConversation(userId, partnerNickname) {
        const partner = await User.findOne({
            where: { nickname: partnerNickname },
            attributes: ['id', 'nickname', 'avatar']
        });

        if (!partner) {
            throw new Error('Пользователь не найден');
        }

        if (partner.id === userId) {
            throw new Error('Нельзя создать диалог с самим собой');
        }

        let conversation = await Conversation.findOne({
            where: {
                [Op.or]: [
                    { user1Id: userId, user2Id: partner.id },
                    { user1Id: partner.id, user2Id: userId }
                ]
            },
            include: [
                {
                    model: User,
                    as: 'user1',
                    attributes: ['id', 'nickname', 'avatar']
                },
                {
                    model: User,
                    as: 'user2',
                    attributes: ['id', 'nickname', 'avatar']
                }
            ]
        });

        if (!conversation) {
            conversation = await Conversation.create({
                user1Id: userId,
                user2Id: partner.id
            });

            conversation = await Conversation.findByPk(conversation.id, {
                include: [
                    { model: User, as: 'user1', attributes: ['id', 'nickname', 'avatar'] },
                    { model: User, as: 'user2', attributes: ['id', 'nickname', 'avatar'] }
                ]
            });
        }

        return conversation;
    }

    async getConversationWithUser(userId, partnerNickname) {
        const partner = await User.findOne({
            where: { nickname: partnerNickname },
            attributes: ['id']
        });

        if (!partner) {
            throw new Error('Пользователь не найден');
        }

        const conversation = await Conversation.findOne({
            where: {
                [Op.or]: [
                    { user1Id: userId, user2Id: partner.id },
                    { user1Id: partner.id, user2Id: userId }
                ]
            },
            include: [
                {
                    model: User,
                    as: 'user1',
                    attributes: ['id', 'nickname', 'avatar']
                },
                {
                    model: User,
                    as: 'user2',
                    attributes: ['id', 'nickname', 'avatar']
                }
            ]
        });

        return conversation;
    }

    async deleteConversation(conversationId, userId) {
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
            throw new Error('Диалог не найден');
        }

        await conversation.destroy();
    }

    async updateLastMessage(conversationId, messageContent) {
        await Conversation.update(
            {
                lastMessage: messageContent,
                lastMessageAt: new Date()
            },
            { where: { id: conversationId } }
        );
    }
}

module.exports = new ConversationService();