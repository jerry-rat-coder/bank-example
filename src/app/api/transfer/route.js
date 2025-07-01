import { NextResponse } from 'next/server'
import { getAccount, updateBalance, checkBalance } from '../../lib/data.js'

export async function POST(request) {
    try {
        // 检查身份验证
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

        // 获取转账信息 - 支持表单数据（CSRF攻击用）和JSON数据（正常用）
        let toAccount, amount
        const contentType = request.headers.get('content-type')

        if (contentType && contentType.includes('application/json')) {
            const data = await request.json()
            toAccount = data.toAccount
            amount = data.amount
        } else {
            // 处理表单数据（CSRF攻击）
            const formData = await request.formData()
            toAccount = formData.get('toAccount')
            amount = parseFloat(formData.get('amount'))
        }

        // 简单验证
        if (!toAccount || !amount || amount <= 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: '转账信息不完整',
                },
                { status: 400 },
            )
        }

        // 获取转账前余额
        const beforeBalance = getAccount(username).balance

        // 检查余额
        if (!checkBalance(username, amount)) {
            return NextResponse.json(
                {
                    success: false,
                    message: '余额不足',
                },
                { status: 400 },
            )
        }

        // 执行转账
        const result = updateBalance(username, amount, { toAccount })

        // ⚠️ 注意：这里没有CSRF保护！
        console.log('🚨 CSRF漏洞：转账被执行了！')
        console.log(`用户 ${username} 向 ${toAccount} 转账 ¥${amount}`)
        console.log(`转账前余额: ¥${beforeBalance}`)
        console.log(`转账后余额: ¥${result.newBalance}`)

        return NextResponse.json({
            success: true,
            message: `转账成功！向 ${toAccount} 转账 ¥${amount}`,
            newBalance: result.newBalance,
        })
    } catch (error) {
        console.error('转账错误:', error)
        return NextResponse.json(
            {
                success: false,
                message: '服务器错误',
            },
            { status: 500 },
        )
    }
}
