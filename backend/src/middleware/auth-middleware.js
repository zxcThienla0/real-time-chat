const tokenService = require('../token/token-service')

module.exports = async function (req, res, next) {
    try {
        const authToken = req.headers.authorization;

        if (!authToken) {
            return res.status(401).json({ message: "No token provided" });
        }

        const accessToken = authToken.split(' ')[1];
        if (!accessToken) {
            return res.status(401).json({ message: "No token provided" });
        }

        const userData = tokenService.validateAccessToken(accessToken);

        if (!userData) {
            return res.status(401).json({
                message: "Access token expired or invalid",
                code: "ACCESS_TOKEN_EXPIRED"
            });
        }

        req.user = userData;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Authentication failed" });
    }
}
