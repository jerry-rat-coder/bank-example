import { NextResponse } from 'next/server'

export async function POST(request) {
    try {
        const response = NextResponse.json({
            success: true,
            message: '登出成功',
        })

        // 清除Cookie
        response.cookies.set('auth_token', '', {
            httpOnly: false,
            maxAge: 0,
            path: '/',
        })

        return response
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
