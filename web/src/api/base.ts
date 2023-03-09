export interface PagedResponse<T> {
    content: T[]
    empty: boolean
    first: boolean
    last: boolean
    number: number
    numberOfElements: number
    size: number
    totalElements: number,
    totalPages: number
}

export interface Pageable {
    page: number,
    size: number
}