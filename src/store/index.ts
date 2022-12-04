import {defineStore} from "pinia";
import {Account, AddAccountParams, ListAccountsResponse} from "../types/account";


const allAccounts = new Array<Account>()

for (let i = 0; i < 100; i++) {
    allAccounts.push({
        id: i.toString(),
        password: "",
        profile: {
            id: i.toString(),
            name: "用户" + (i + 1),
            gender: "male",
            mobileNumber: "1333333" + i.toString().padStart(4, "0")
        },
        balance: 100 + i,
    })
}

export const useStore = defineStore("main", {
    state: () => ({accounts: allAccounts}),
    actions: {
        async listAllAccounts(keyword: string, page: number, size: number): Promise<ListAccountsResponse> {
            let filteredAccounts = new Array<Account>()
            if (!keyword) {
                filteredAccounts = this.accounts;
            } else {
                filteredAccounts = this.accounts.filter(item => {
                    if (item.profile.mobileNumber.includes(keyword)) {
                        return true
                    } else if (item.profile.name.includes(keyword)) {
                        return true
                    }

                    return false;
                })
            }

            const start = (page - 1) * size
            const end = start + size

            return {
                content: filteredAccounts.slice(start, end),
                page: page,
                size: size,
                total: filteredAccounts.length
            };
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
            const account = {
                id: id,
                password: "",
                profile: {
                    id: id,
                    name: params.name,
                    gender: params.gender,
                    mobileNumber: params.mobileNumber
                },
                balance: params.initBalance
            }
            this.accounts.push(account)
            return account
        }
    }
})
