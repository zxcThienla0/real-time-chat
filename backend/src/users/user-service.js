const bcrypt = require('bcrypt');
const UserDto = require("./dto/user.dto")
const tokenService = require("./../token/token-service")
const APIError = require('./../exception/api-error')
const {User, Token} = require('./../models/index') // ← Добавил Token
const {Op} = require('sequelize');

class UserService {

    async registration(email, password, nickname) {
        try {
            const candidate = await User.findOne({
                where: {
                    [Op.or]: [
                        { email },
                        { nickname }
                    ]
                }
            });
            if (candidate) {
                throw APIError.BadRequestError('Пользователь уже существует')
            }

            const user = await User.create({
                email,
                password: password,
                nickname: nickname,
            })

            const userDto = new UserDto(user);
            const tokens = await tokenService.generateToken(userDto.toJSON());

            await tokenService.saveToken(userDto.id, tokens.refreshToken);

            return {
                ...tokens,
                user: userDto
            }

        } catch (error) {
            throw error
        }
    }

    async login(email, password) {
        try {
            const user = await User.findOne({ where: { email } })

            if (!user) {
                throw new Error('Пользователь с таким Email не найден');
            }

            const isPassEqual = await bcrypt.compare(password, user.password);

            if (!isPassEqual) {
                throw new Error('Неверный пароль')
            }

            const userDto = new UserDto(user);
            const tokens = await tokenService.generateToken(userDto.toJSON());

            await tokenService.saveToken(userDto.id, tokens.refreshToken);
            return {
                ...tokens,
                user: userDto
            }
        } catch (err) {
            throw err
        }
    }

    async logout(refreshToken) {
        try {
            const tokenFromDb = await Token.findOne({
                where: { refreshToken }
            });

            if (!tokenFromDb) {
                console.log('Токен не найден в базе данных при выходе из системы');
                return { success: true };
            }

            await tokenService.removeToken(refreshToken);
            return { success: true };
        } catch (error) {
            return { success: true };
        }
    }

    async refresh(refreshToken) {
        console.log(`Refresh token: ${refreshToken}`);
        if (!refreshToken) {
            throw APIError.UnathorizedError();
        }

        const userData = tokenService.validateRefreshToken(refreshToken);
        if (!userData) {
            throw APIError.UnathorizedError();
        }

        const tokenFromDb = await Token.findOne({
            where: {refreshToken},
            include: [{
                model: User,
                as: 'user'
            }]
        });

        if (!tokenFromDb || !tokenFromDb.user) {
            throw APIError.UnathorizedError();
        }

        if (tokenFromDb.user.id !== userData.id) {
            throw APIError.UnathorizedError();
        }

        const userDto = new UserDto(tokenFromDb.user);
        const tokens = await tokenService.generateToken(userDto.toJSON());

        await Token.update(
            { refreshToken: tokens.refreshToken },
            { where: { id: tokenFromDb.id } }
        );

        return {
            ...tokens,
            user: userDto
        };
    }

    async getProfile(userId) {
        try {
            const user = await User.findByPk(userId, {
                attributes: { exclude: ['password'] }
            });

            if (!user) {
                throw APIError.UnathorizedError();
            }

            return new UserDto(user);

        } catch (error) {
            throw error;
        }
    }
}

module.exports = new UserService();