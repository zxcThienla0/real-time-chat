class UserDto {
    constructor(user) {
        this.id = user.id;
        this.email = user.email;
        this.password = user.password;
        this.nickname = user.nickname;
    }

    toJSON() {
        return {
            id: this.id,
            email: this.email,
            password: this.password,
            nickname: this.nickname,
        };
    }
}

module.exports = UserDto;