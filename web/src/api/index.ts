import axios from "axios"
import {Account} from "../types/account"
import {Bill} from "../types/bill"
import {Transaction} from "../types/transaction"
import auth from "./auth"
import shop from "./shop"

axios.defaults.baseURL = "http://localhost:8080/api/"
axios.defaults.withCredentials = true
axios.defaults.xsrfCookieName = "XSRF-TOKEN"
axios.defaults.xsrfHeaderName = "X-XSRF-TOKEN"
axios.interceptors.response.use(
    (res) => {
        return res.data
    },
)

export class ApiError extends Error {
}


interface PaginationParams {
    page: number,
    size: number,
}

interface PaginationResponse {
    page: number,
    size: number,
    total: number
}

export interface ListAccountsResponse extends PaginationResponse {
    content: Array<Account>,

}

// 从LocalStorage读取所有Account
const loadAllAccounts = async (): Promise<Array<Account>> => {
    const accountsString = window.localStorage.getItem("accounts")
    if (!accountsString) {
        throw new ApiError("读取用户信息失败")
    }

    const accounts = JSON.parse(accountsString)
    if (!accounts) {
        throw new ApiError("解析用户信息失败")
    }

    return accounts as Array<Account>
}

const saveAllAccounts = async (accounts: Array<Account>) => {
    const accountsString = JSON.stringify(accounts)
    window.localStorage.setItem("accounts", accountsString)
}

const loadAllBills = async (): Promise<Array<Bill>> => {
    const billsString = window.localStorage.getItem("bills")
    if (!billsString) {
        throw new ApiError("读取账单失败")
    }

    const allBills = JSON.parse(billsString)
    if (!allBills) {
        throw new ApiError("解析账单失败")
    }

    return allBills as Array<Bill>
}

const saveAllBills = async (bills: Array<Bill>) => {
    const billsString = JSON.stringify(bills)
    window.localStorage.setItem("bills", billsString)
}

const loadAllTransactions = async (): Promise<Array<Transaction>> => {
    const transactionsString = window.localStorage.getItem("transactions")
    if (!transactionsString) {
        throw new ApiError("读取订单失败")
    }

    const allTransactions = JSON.parse(transactionsString)
    if (!allTransactions) {
        throw new ApiError("解析订单失败")
    }

    return allTransactions as Array<Transaction>
}

const saveAllTransactions = async (transactions: Array<Transaction>) => {
    const transactionsString = JSON.stringify(transactions)
    window.localStorage.setItem("transactions", transactionsString)
}

interface ListAllTransactionsParams extends PaginationParams {
    accountId: string
}

interface ListTransactionsResponse extends PaginationResponse {
    content: Array<Transaction>,
}

export const listAllTransactions = async (params: ListAllTransactionsParams): Promise<ListTransactionsResponse> => {
    const allTransactions = await loadAllTransactions()
    if (!allTransactions) {
        return {
            content: Array<Transaction>(),
            page: params.page,
            size: params.size,
            total: 0,
        }
    }

    const filteredTransactions = allTransactions
        .filter(item => (item.fromAccountId === params.accountId || item.toAccountId === params.accountId))

    const start = (params.page - 1) * params.size
    const end = start + params.size

    return {
        content: filteredTransactions.slice(start, end),
        page: params.page,
        size: params.size,
        total: filteredTransactions.length,
    }
}

export interface GetTransactionParams {
    id: string
}

export const getTransaction = async (params: GetTransactionParams): Promise<Transaction | void> => {
    const allTransactions = await loadAllTransactions()
    const transaction = allTransactions.find(item => item.id === params.id)
    if (transaction) {
        return transaction
    }
}

interface TransferParams {
    from: string,
    to: string,
    balance: number
}

export const transfer = async (params: TransferParams) => {
    const balance = Number(params.balance)
    if (balance < 0) {
        throw new Error("金额不能为负数")
    }

    const allAccounts = await loadAllAccounts()
    const fromAccount = allAccounts.find(item => item.id === params.from)
    if (!fromAccount) {
        throw new Error("付款人不存在")
    }

    const toAccount = allAccounts.find(item => item.id === params.to)
    if (!toAccount) {
        throw new Error("收款人不存在")
    }

    const shop = allAccounts[0]
    if (fromAccount.id !== shop.id && fromAccount.balance < balance) {
        throw new Error("余额不足")
    }

    const now = new Date()

    const allTransactions = await loadAllTransactions()

    const transaction = {
        id: allTransactions.length.toString(),
        fromAccountId: params.from,
        toAccountId: params.to,
        number: new Date().getTime().toString(), // TODO: 订单号算法
        amount: balance,
        operatorName: "商家",// TODO: 实现多用户
        datetime: now,
    }
    allTransactions.push(transaction)

    await saveAllTransactions(allTransactions)

    const preFromAccountBalance = fromAccount.balance
    fromAccount.balance = preFromAccountBalance - balance
    const preToAccountBalance = toAccount.balance
    toAccount.balance = preToAccountBalance + balance

    await saveAllAccounts(allAccounts)

    const allBills = await loadAllBills()

    const fromAccountBill: Bill = {
        id: allBills.length.toString(),
        accountId: params.from,
        transactionId: transaction.id,
        amount: -balance,
        previousBalance: preFromAccountBalance,
        currentBalance: fromAccount.balance,
        datetime: now,
    }

    allBills.push(fromAccountBill)
    const toAccountBill: Bill = {
        id: allBills.length.toString(),
        accountId: params.to,
        transactionId: transaction.id,
        amount: balance,
        previousBalance: preToAccountBalance,
        currentBalance: toAccount.balance,
        datetime: now,
    }
    allBills.push(toAccountBill)

    await saveAllBills(allBills)
}

export type {AddShopParams} from "./shop"

export default {
    auth,
    shop,
    listAllTransactions,
    getTransaction,
    transfer,
}