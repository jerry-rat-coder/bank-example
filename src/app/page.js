'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [message, setMessage] = useState('')
    const [account, setAccount] = useState(null)
    const router = useRouter()

    // 获取账户信息
    const fetchAccountInfo = async () => {
        try {
            const response = await fetch('/api/account', {
                credentials: 'include',
            })
            const data = await response.json()
            console.log('🚀 ~ fetchAccountInfo ~ data:', data)
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
                    setUsername(data.user.username)
                    fetchAccountInfo()
                }
            })
            .catch(() => {})
    }, [])

    const handleLogin = async (e) => {
        e.preventDefault()

        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ username, password }),
        })

        const data = await response.json()

        if (data.success) {
            setIsLoggedIn(true)
            setMessage('登录成功！')
            fetchAccountInfo()
        } else {
            setMessage('登录失败：' + data.message)
        }
    }

    const handleLogout = async () => {
        await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include',
        })
        setIsLoggedIn(false)
        setAccount(null)
        setMessage('已登出')
    }

    if (isLoggedIn) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
                <div className="max-w-4xl mx-auto">
                    <header className="bg-white shadow-lg rounded-lg p-6 mb-8">
                        <div className="flex justify-between items-center">
                            <h1 className="text-3xl font-bold text-blue-600">
                                🏦 安全银行
                            </h1>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            >
                                登出
                            </button>
                        </div>
                    </header>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* 账户信息 - 实时显示 */}
                        <div className="bg-white shadow-lg rounded-lg p-6">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">
                                账户信息
                            </h2>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        用户名：
                                    </span>
                                    <span className="font-semibold">
                                        {account?.username || username}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        账户余额：
                                    </span>
                                    <span className="font-bold text-green-600 text-lg">
                                        ¥{' '}
                                        {account?.balance?.toLocaleString() ||
                                            '10,000.00'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        账号状态：
                                    </span>
                                    <span className="text-green-600">
                                        ● 活跃
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* 转账操作 */}
                        <div className="bg-white shadow-lg rounded-lg p-6">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">
                                操作面板
                            </h2>
                            <div className="space-y-3">
                                <button
                                    onClick={() => router.push('/transfer')}
                                    className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition"
                                >
                                    💸 立即转账
                                </button>
                                <button
                                    onClick={fetchAccountInfo}
                                    className="w-full bg-green-500 text-white p-3 rounded hover:bg-green-600 transition"
                                >
                                    🔄 刷新余额
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 交易记录 */}
                    {account?.transactions &&
                        account.transactions.length > 0 && (
                            <div className="mt-8 bg-white shadow-lg rounded-lg p-6">
                                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                                    最近交易
                                </h2>
                                <div className="space-y-3">
                                    {account.transactions
                                        .slice(-3)
                                        .reverse()
                                        .map((transaction) => (
                                            <div
                                                key={transaction.id}
                                                className="border-l-4 border-red-400 pl-4 py-2 bg-red-50"
                                            >
                                                <div className="flex justify-between items-center">
                                                    <span className="font-semibold text-red-700">
                                                        转出给: {transaction.to}
                                                    </span>
                                                    <span className="font-bold text-red-600">
                                                        -¥{transaction.amount}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8">
            <div className="bg-white shadow-2xl rounded-lg p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-blue-600 mb-2">
                        🏦 安全银行
                    </h1>
                    <p className="text-gray-600">演示用网银系统</p>
                </div>

                <form
                    onSubmit={handleLogin}
                    className="space-y-6"
                >
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            用户名
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                            placeholder="请输入用户名"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            密码
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                            placeholder="请输入密码"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    >
                        登录
                    </button>
                </form>

                {message && (
                    <div
                        className={`mt-4 p-3 rounded ${
                            message.includes('成功')
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                        }`}
                    >
                        {message}
                    </div>
                )}

                <div className="mt-6 text-center text-sm text-gray-500">
                    <p>演示账户：用户名和密码相同</p>
                    <p className="mt-1">（如：admin/admin）</p>
                </div>
            </div>
        </div>
    )
}
