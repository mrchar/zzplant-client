import {defineStore} from "pinia";
import {Account, AddAccountParams, ListAccountsResponse} from "../src/types/account";


const allAccounts = new Array<Account>()

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
