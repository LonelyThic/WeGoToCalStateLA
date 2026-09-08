
export const cookieConfig = {
    httpOnly: true,
    maxAge: 60000 * 60,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: 'lax',
}


export const oidcCookieConfig = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 5 * 60000,
    path: "/",
    sameSite: 'lax',
}

export const otpTokenCookieConfig = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 5 * 60000,
    path: '/',
    sameSite: 'lax',
}

export const signupTokenCookieConfig= {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 5 * 60000,
    path: '/',
    sameSite: 'lax',
}


export const loginTokenCookieConfig= {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 5 * 60000,
    path: '/',
    sameSite: 'lax',
}

