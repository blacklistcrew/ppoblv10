export const DepositStat = {
    failed: 0,
    waiting_approval: 1,
    success: 2,
    waiting_payment: 3
}

export const DepositLabel = ['Failed', 'Waiting Approval Admin','Succes','Waiting Payment']

export default interface DepositType {
    id: number
    nominal: number
    note: string
    image: string
    bank: string
    account_number: string
    status: number
    created_at: string
    created_at_formatted: string
}