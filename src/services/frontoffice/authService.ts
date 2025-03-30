import { decrypt } from "@utils/secure"

export default class AuthService {
    protected id: string
    protected username: string

    public constructor(token: string) {
        const data = token.split('.')
        const decoded = Buffer.from(data[1], 'base64').toString('utf-8')
        const parsed = JSON.parse(decoded)
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
