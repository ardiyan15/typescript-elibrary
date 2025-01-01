import { IUser } from "@models/backoffice/users/user"

export interface IDataTableResponse<T> {
    data: T[],
    recordsTotal: number,
    recordsFiltered: number
}

export interface IUserLogin {
    isUserValid: boolean
    data?: IUser
}