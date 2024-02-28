export default interface ProductType {
    id: number
    name: string
    code: string
    price: number
    commission:number
    total: number
    desc: string
    status: number
    status_name?: string
    created_at: string
}