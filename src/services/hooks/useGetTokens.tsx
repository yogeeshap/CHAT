// import { InteractionRequiredAuthError } from '@azure/msal-browser'
// import { useCallback } from 'react'

// export const useGetToken = () => {
//   const currentAccount = instance.getActiveAccount()
//   const getToken = useCallback(async () => {
//     try {
//       const response = await instance.acquireTokenSilent({
//         ...loginRequest,
//         account: currentAccount!,
//       })

//       sessionStorage.setItem('vfuToken', response.accessToken)
//       return response.accessToken
//     } catch (error) {
//       console.error(error)
//       return undefined
//     }
//   }, [currentAccount, instance])

//   return getToken
// }
