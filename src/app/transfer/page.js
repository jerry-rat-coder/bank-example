'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function TransferPage() {
    const [toAccount, setToAccount] = useState('')
    const [amount, setAmount] = useState('')
    const [message, setMessage] = useState('')
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [account, setAccount] = useState(null)
    const router = useRouter()

    const fetchAccountInfo = async () => {
        try {
            const response = await fetch('/api/account', {
                credentials: 'include',
            })
            const data = await response.json()
            if (data.success) {
                setAccount(data.account)
            }
        } catch (error) {
            console.error('获取账户信息失败:', error)
        }
    }

    useEffect(() => {
        // 检查是否已登录
        fetch('/api/auth/check', {
            credentials: 'include',
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setIsLoggedIn(true)
                    fetchAccountInfo()
                } else {
                    router.push('/')
                }
            })
            .catch(() => {
                router.push('/')
            })
    }, [router])

    const handleTransfer = async (e) => {
        e.preventDefault()

        const response = await fetch('/api/transfer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                toAccount,
                amount: parseFloat(amount),
            }),
        })

        const data = await response.json()
        setMessage(data.message)

        if (data.success) {
            setToAccount('')
            setAmount('')
            // 刷新账户信息
            setTimeout(fetchAccountInfo, 500)
        }
    }

    if (!isLoggedIn) {
        return <div>正在验证登录状态...</div>
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
            <div className="max-w-2xl mx-auto">
                <header className="bg-white shadow-lg rounded-lg p-6 mb-8">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-blue-600">
                            💸 银行转账
                        </h1>
                        <button
                            onClick={() => router.push('/')}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        >
                            返回首页
                        </button>
                    </div>
                </header>

                {account && (
                    <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
                        <h2 className="text-lg font-semibold mb-2">当前余额</h2>
                        <div className="text-2xl font-bold text-green-600">
                            ¥{account.balance.toLocaleString()}
                        </div>
                    </div>
                )}

                <div className="bg-white shadow-lg rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-6">转账汇款</h2>

                    <form
                        onSubmit={handleTransfer}
                        className="space-y-4"
                    >
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                收款账户
                            </label>
                            <input
                                type="text"
                                value={toAccount}
                                onChange={(e) => setToAccount(e.target.value)}
                                placeholder="请输入收款账户"
                                className="w-full p-3 border border-gray-300 rounded text-black"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                转账金额
                            </label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="请输入转账金额"
                                min="0.01"
                                step="0.01"
                                className="w-full p-3 border border-gray-300 rounded text-black"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition text-lg"
                        >
                            确认转账
                        </button>
                    </form>

                    {message && (
                        <div
                            className={`mt-4 p-3 rounded ${
                                message.includes('成功')
                                    ? 'bg-green-100 text-green-700 border border-green-300'
                                    : 'bg-red-100 text-red-700 border border-red-300'
                            }`}
                        >
                            {message}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
