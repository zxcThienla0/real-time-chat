const userService = require('./user-service');

class UserController {
    async login(req, res, next) {
        try {
            const {email, password} = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    message: 'Email и password обязательны'
                });
            }

            const userData = await userService.login(email, password);

            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true
            });

            return res.json(userData);
        } catch (error) {
            next(error);
        }
    }

    async logout(req, res, next) {
        try {
            const refreshToken = req.cookies?.refreshToken;

            if (!refreshToken) {
                return res.status(400).json({message: 'Refresh token is required'});
            }
            const userData = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(userData);
        } catch (error) {
            next(error);
        }
    }

    async registration(req, res, next) {
        try {
            const {email, password, nickname} = req.body;

            if (!email || !password || !nickname) {
                return res.status(400).json({
                    message: 'Email, password и nickname обязательны'
                });
            }

            if (password.length < 6) {
                return res.status(400).json({
                    message: 'Пароль должен быть не менее 6 символов'
                });
            }

            const userData = await userService.registration(email, password, nickname);

            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true
            });

            return res.json(userData);
        } catch (error) {
            next(error);
        }
    }


    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies;

            if (!refreshToken) {
                return res.status(401).json({message: 'Refresh token not found'});
            }

            const userData = await userService.refresh(refreshToken);

            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                sameSite: 'lax'
            });

            return res.json(userData);
        } catch (error) {
            next(error);
        }
    }

    async getProfile(req, res, next) {
        try {
            const userId = req.user.id;
            const user = await userService.getProfile(userId);
            res.json(user);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new UserController;