export interface Bill {
    id: string,
    accountId: string,
    transactionId: string,
    amount: number,
    previousBalance: number, // 操作前余额
    currentBalance: number, // 操作后余额
    datetime: Date,
}