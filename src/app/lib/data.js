// 模拟数据库 - 共享数据存储
const accounts = {
    admin: {
        balance: 10000,
        transactions: [],
    },
}

// 获取账户信息
export function getAccount(username) {
    if (!accounts[username]) {
        accounts[username] = {
            balance: 10000,
            transactions: [],
        }
    }
    return accounts[username]
}

// 更新账户余额
export function updateBalance(username, amount, transactionData) {
    const account = getAccount(username)
    account.balance -= amount

    const transaction = {
        id: Date.now(),
        to: transactionData.toAccount,
        amount: amount,
        timestamp: new Date().toLocaleString('zh-CN'),
    }

    account.transactions.push(transaction)

    return {
        transaction,
        newBalance: account.balance,
    }
}

// 检查余额是否足够
export function checkBalance(username, amount) {
    const account = getAccount(username)
    return account.balance >= amount
}

export { accounts }
