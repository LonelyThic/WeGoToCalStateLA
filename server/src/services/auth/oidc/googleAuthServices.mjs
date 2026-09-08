
export function createGoogleAuthService(oidcService){
    return{
        startGoogleSignup,
        completeGoogleSignup
    }
    async function startGoogleSignup() {
        const { token, redirectURL } = await oidcService.startOIDCSignup()
        return { token, redirectURL }
    }

    async function completeGoogleSignup(oidcValue, currentURL) {
        const email = await oidcService.completeOIDCSignup(oidcValue, currentURL)
        return email
    }
}