export default interface TransactionType {
    id: number
    product_name: string
    total: number
    note: string
    mtrpln: string
    target: string
    status: number
    token: string
    created_at: string
    created_at_formatted: string
}

export type StatusType = {
    label: string,
    color: string,
    desc: string
}