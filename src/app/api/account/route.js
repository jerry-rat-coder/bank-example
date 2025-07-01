import { NextResponse } from 'next/server'
import { getAccount } from '../../lib/data.js'

export async function GET(request) {
    try {
        const authToken = request.cookies.get('auth_token')

        if (!authToken) {
            return NextResponse.json(
                {
                    success: false,
                    message: '请先登录',
                },
                { status: 401 },
            )
        }

        const username = authToken.value
            .replace('user_', '')
            .replace('_token', '')

        // 获取用户账户信息
        const account = getAccount(username)

        return NextResponse.json({
            success: true,
            account: {
                username,
                balance: account.balance,
                transactions: account.transactions.slice(-10), // 最近10条记录
            },
        })
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: '服务器错误',
            },
            { status: 500 },
        )
    }
}
