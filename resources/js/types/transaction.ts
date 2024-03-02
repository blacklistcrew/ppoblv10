export default interface TransactionType {
    id: number
    product_name: string
    price: number
    commission: number
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

export const TrsansactionStat = {
    failed: 0,
    process: 1,
    success: 2,
    waiting_payment: 3
}