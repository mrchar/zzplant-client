export interface Transaction {
    id: string,
    fromAccountId: string | "",
    toAccountId: string
    number: string,
    amount: number,
    operatorName: string,
    datetime: Date
}