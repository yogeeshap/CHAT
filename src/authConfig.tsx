// Browser check variables
// If you support IE, our recommendation is that you sign-in using Redirect APIs
// If you as a developer are testing using Edge InPrivate mode, please add "isEdge" to the if check
const ua = window.navigator.userAgent
const msie = ua.indexOf('MSIE ')
const msie11 = ua.indexOf('Trident/')
const msedge = ua.indexOf('Edge/')
const firefox = ua.indexOf('Firefox')
const isIE = msie > 0 || msie11 > 0
const isEdge = msedge > 0
const isFirefox = firefox > 0 // Only needed if you need to support the redirect flow in Firefox incognito

// Config object to be passed to Msal on creation
const authConfig = {
  auth: {
    apiUrl: import.meta.env.VITE_API_URL,
    wsUrl:import.meta.env.VITE_WS_URL,
    redirectUri: '/',
    postLogoutRedirectUri: '/',
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: isIE || isEdge || isFirefox,
  }
}

export default authConfig
