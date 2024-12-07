export interface IDataTableResponse<T> {
    data: T[],
    recordsTotal: number,
    recordsFiltered: number
}