import { NextResponse } from 'next/server'

export async function POST(request) {
    try {
        const { username, password, sameSiteMode } = await request.json()

        // 简单的验证逻辑：用户名和密码相同即可登录
        if (username && password && username === password) {
            // 创建响应
            const response = NextResponse.json({
                success: true,
                message: '登录成功',
                user: { username },
            })

            let cookieOptions = {
                httpOnly: false,
                maxAge: 3600,
                path: '/',
                domain: 'localhost',
            }

            if (sameSiteMode === 'strict') {
                cookieOptions.sameSite = 'strict'
            } else if (sameSiteMode === 'lax') {
                cookieOptions.sameSite = 'lax'
            } else if (sameSiteMode === 'none') {
                cookieOptions.sameSite = 'none'
                cookieOptions.secure = true
            }

            response.cookies.set(
                'auth_token',
                `user_${username}_token_${sameSiteMode || 'default'}`,
                cookieOptions,
            )

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
