import {defineStore} from "pinia"
import {Account, AddAccountParams, ListAccountsResponse} from "../types/account"
import {Transaction} from "../types/transaction"
import {Bill} from "../types/bill"

export const minerId: string = "00000000000"
export const shopId: string = "11111111111"

interface StoreState {
    accounts: Array<Account>,
    bills: Array<Bill>,
    transactions: Array<Transaction>
}

export const useStore = defineStore("main", {
    state: (): StoreState => ({
        accounts: new Array<Account>(),
        bills: new Array<Bill>(),
        transactions: new Array<Transaction>(),
    }),
    actions: {
        async loadData() {
            const data = window.localStorage.getItem("data")
            // TODO: 需要主动创建店铺
            if (!data) {
                this.accounts.push(
                    {
                        id: minerId,
                        password: "",
                        profile: {
                            id: minerId,
                            name: "miner",
                            gender: "",
                            mobileNumber: "",
                        },
                        balance: 0,
                    },
                    {
                        id: shopId,
                        password: "",
                        profile: {
                            id: shopId,
                            name: "shop",
                            gender: "",
                            mobileNumber: "",
                        },
                        balance: 0,
                    })
                return
            }

            const storeState = JSON.parse(data) as StoreState

            this.accounts = storeState.accounts
            this.bills = storeState.bills
            this.transactions = storeState.transactions
        },
        async saveData() {
            const data = JSON.stringify({
                accounts: this.accounts,
                bills: this.bills,
                transactions: this.transactions,
            })

            window.localStorage.setItem("data", data)
        },
        async listAllAccounts(keyword: string, page: number, size: number): Promise<ListAccountsResponse> {
            const allAccounts = this.accounts.slice(2)
            let filteredAccounts = new Array<Account>()
            if (!keyword) {
                filteredAccounts = allAccounts
            } else {
                filteredAccounts = allAccounts.filter(item => {
                    if (item.profile.mobileNumber.includes(keyword)) {
                        return true
                    } else if (item.profile.name.includes(keyword)) {
                        return true
                    }

                    return false
                })
            }

            const start = (page - 1) * size
            const end = start + size

            return {
                content: filteredAccounts.slice(start, end),
                page: page,
                size: size,
                total: filteredAccounts.length,
            }
        },
        async getAccount(name: string): Promise<Account | void> {
            const account = this.accounts.find(item => {
                return item.profile.name === name
            })
            if (account) {
                return account
            }

        },
        async addAccount(params: AddAccountParams): Promise<Account> {
            const id = this.accounts.length.toString()
            const balance = Number(params.initBalance)
            const account = {
                id: id,
                password: "",
                profile: {
                    id: id,
                    name: params.name,
                    gender: params.gender,
                    mobileNumber: params.mobileNumber,
                },
                balance: 0,
            }
            this.accounts.push(account)

            if (balance > 0) {
                await this.transfer(minerId, account.id, balance)
            }
            await this.saveData()
            return account
        },
        async listAllBills(accountName: string): Promise<Array<Bill>> {
            const account = this.accounts.find(item => item.profile.name === accountName)
            if (!account) {
                return new Array<Bill>()
            }

            return this.bills.filter(item => item.accountId === account.id)
        },
        async listAllTransactions(accountName: string): Promise<Array<Transaction>> {
            const account = this.accounts.find(item => item.profile.name === accountName)
            if (!account) {
                return new Array<Transaction>()
            }

            return this.transactions.filter(item =>
                item.fromAccountId === account.id || item.toAccountId === account.id)
        },
        async transfer(from: string, to: string, balance: number) {
            balance = Number(balance)
            if (balance < 0) {
                throw new Error("金额不能为负数")
            }

            const fromAccount = this.accounts.find(item => item.id === from)
            if (!fromAccount) {
                throw new Error("付款人不存在")
            }

            const toAccount = this.accounts.find(item => item.id === to)
            if (!toAccount) {
                throw new Error("收款人不存在")
            }

            if (fromAccount.id !== minerId && fromAccount.balance < balance) {
                throw new Error("余额不足")
            }

            const now = new Date()

            const transaction = {
                id: this.transactions.length.toString(),
                fromAccountId: from,
                toAccountId: to,
                number: new Date().getTime().toString(), // TODO: 订单号算法
                amount: balance,
                operatorName: "商家",// TODO: 实现多用户
                datetime: now,
            }
            this.transactions.push(transaction)

            const preFromAccountBalance = fromAccount.balance
            fromAccount.balance = preFromAccountBalance - balance
            const preToAccountBalance = toAccount.balance
            toAccount.balance = preToAccountBalance + balance

            const fromAccountBill: Bill = {
                id: this.bills.length.toString(),
                accountId: from,
                transactionId: transaction.id,
                amount: -balance,
                previousBalance: preFromAccountBalance,
                currentBalance: fromAccount.balance,
                datetime: now,
            }

            this.bills.push(fromAccountBill)
            const toAccountBill: Bill = {
                id: this.bills.length.toString(),
                accountId: to,
                transactionId: transaction.id,
                amount: balance,
                previousBalance: preToAccountBalance,
                currentBalance: toAccount.balance,
                datetime: now,
            }
            this.bills.push(toAccountBill)

            await this.saveData()
        },
    },
})
