import { NextResponse } from 'next/server'

export async function POST(request) {
    try {
        const { username, password } = await request.json()

        // 简单的验证逻辑：用户名和密码相同即可登录
        if (username && password && username === password) {
            // 创建响应
            const response = NextResponse.json({
                success: true,
                message: '登录成功',
                user: { username },
            })

            // 设置Cookie（故意设置为不安全，演示CSRF漏洞）
            response.cookies.set('auth_token', `user_${username}_token`, {
                httpOnly: false, // 故意设为false，演示漏洞
                maxAge: 3600, // 1小时
                path: '/',
                // 不设置sameSite，让浏览器使用默认行为lax
                sameSite: 'none',
                secure: true,
            })

            return response
        } else {
            return NextResponse.json(
                {
                    success: false,
                    message: '用户名或密码错误',
                },
                { status: 401 },
            )
        }
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
