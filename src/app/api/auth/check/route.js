import { NextResponse } from 'next/server'

export async function GET(request) {
    try {
        const authToken = request.cookies.get('auth_token')

        if (authToken) {
            const username = authToken.value
                .replace('user_', '')
                .replace('_token', '')
            return NextResponse.json({
                success: true,
                user: { username },
            })
        } else {
            return NextResponse.json(
                {
                    success: false,
                    message: '未登录',
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
