const jwt = require("jsonwebtoken");
const {Token} = require('./../models/index')

class tokenService {

    constructor() {
        if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) {
            throw new Error('JWT secrets are not defined in environment variables');
        }
        console.log('JWT secrets loaded:', {
            access: !!process.env.JWT_ACCESS_SECRET,
            refresh: !!process.env.JWT_REFRESH_SECRET
        });
    }

    async generateToken(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '30d'});
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '365d'});
        return {
            accessToken,
            refreshToken
        }
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return userData;
        } catch (error) {
            return null
        }
    }

    validateRefreshToken(token) {
        try {
            if (!token) {
                return null;
            }
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return userData;
        } catch (error) {
            return null;
        }
    }

    async saveToken(userId, refreshToken) {
        try {
            const tokenData = await Token.findOne({
                where: { userId }
            })

            if (tokenData) {
                await Token.update(
                    { refreshToken: refreshToken },
                    { where: { id: tokenData.id } }
                )
                return await Token.findByPk(tokenData.id);
            }

            const token = await Token.create({
                refreshToken: refreshToken,
                userId: userId,
                expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 365 дней
            })
            return token;

        } catch (error) {
            console.error('Save token error:', error);
            throw error;
        }
    }

    async findToken(refreshToken) {
        const tokenData = await Token.findOne({
            where: { refreshToken }
        });
        return tokenData;
    }

    async removeToken(refreshToken) {
        try {
            const tokenData = await Token.destroy({
                where: { refreshToken }
            });
            return tokenData;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new tokenService();