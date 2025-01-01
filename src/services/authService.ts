import { decrypt } from "@utils/secure"

export default class AuthService {
    protected id: string
    protected username: string

    public constructor(token: string) {
        let data = token.split('.')
        data[1]
        let decoded = Buffer.from(data[1], 'base64').toString('utf-8')
        let parsed = JSON.parse(decoded)
        this.id = decrypt(parsed.id)
        this.username = decrypt(parsed.username)
    }

    getUser() {
        return {
            id: this.id,
            username: this.username
        }
    }
}
