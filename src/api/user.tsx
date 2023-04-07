import axios from 'axios'
import { API_URL, EXPIRATION_TIME, LS_KEY } from '../config'
import jwtDecode, { JwtPayload } from 'jwt-decode'
import { store } from '../store'
import {
    AUTHENTICATED,
    AUTHENTICATION_EXPIRED,
    NOT_AUTHENTICATED,
} from '../actions/actionTypes'
import { RoleTypes } from '../reducers/authorizationReducer'

const deleteToken = () => {
    localStorage.removeItem(LS_KEY)
}

export const signout = async () => {
    deleteToken()
    store.dispatch({ type: NOT_AUTHENTICATED, payload: {} })
}

export const getUser = async (accountAddress: string) => {
    try {
        const res = await axios.get(`${API_URL}/user/${accountAddress}`)
        return res
    } catch (e) {
        console.error('GetUser Error', e)
        return null
    }
}

export const checkAuth = () => {
    const now = Math.floor(Date.now() / 1000)
    const timeAllowed = EXPIRATION_TIME * 60 * 60 // 5min
    const ls = window.localStorage.getItem(LS_KEY)
    let result = NOT_AUTHENTICATED
    if (ls !== 'undefined' && ls) {
        const auth = ls && JSON.parse(ls)
        const decodedToken: any = jwtDecode(auth)
        const payload = decodedToken.payload

        const { loggedTime } = payload

        if (now - loggedTime < timeAllowed) {
            store.dispatch({
                type: AUTHENTICATED,
                payload: {
                    id: payload.id,
                    walletAddress: payload.accountAddress,
                    artistName: payload.artistName,
                    artistId: payload?.artistId,
                    role: payload.role,
                    shutDownStatus: payload?.shutDownStatus,
                },
            })
            result = AUTHENTICATED
        } else {
            store.dispatch({
                type: AUTHENTICATION_EXPIRED,
                payload: {
                    id: null,
                    walletAddress: null,
                    artistName: null,
                    artistId: null,
                    role: RoleTypes.None,
                    shutDownStatus: null,
                },
            })
            result = AUTHENTICATION_EXPIRED
        }
    } else {
        store.dispatch({
            type: NOT_AUTHENTICATED,
            payload: {
                id: null,
                walletAddress: null,
                artistName: null,
                artistId: null,
                role: RoleTypes.None,
                shutDownStatus: null,
            },
        })
        result = NOT_AUTHENTICATED
    }
    return result
}

export const verifySignature = async (verifyData) => {
    try {
        const res = await axios.post(`${API_URL}/user/auth`, verifyData)
        if (res.status === 200 && res.data.success) {
            localStorage.setItem(
                LS_KEY,
                JSON.stringify(res.data.data.accessToken),
            )
            const decodedToken: any = jwtDecode(res.data.data.accessToken)
            const payload = decodedToken.payload
            store.dispatch({
                type: AUTHENTICATED,
                payload: {
                    id: payload.id,
                    walletAddress: payload.accountAddress,
                    artistName: payload.artistName,
                    artistId: payload?.artistId,
                    role: payload.role,
                    shutDownStatus: payload.shutDownStatus,
                },
            })
        } else {
            deleteToken()
            store.dispatch({
                type: NOT_AUTHENTICATED,
                payload: {
                    id: null,
                    walletAddress: null,
                    artistName: null,
                    artistId: null,
                    role: RoleTypes.None,
                    shutDownStatus: null,
                },
            })
        }
        return res.data
    } catch (e) {
        console.error('Error while logging in', e)
        return false
    }
}

// export const emailVerify = async (
//     personalEmail: string,
//     spotifyEmail: string,
//     usptoEmail: string,
//     accountAddress: string,
//     spotify: any,
//     uspto: any,
// ) => {
//     const res = await axios.post(`${API_URL}/user/verify-email`, {
//         personalEmail,
//         spotifyEmail,
//         usptoEmail,
//         accountAddress,
//         spotify,
//         uspto,
//     })
//     return res
// }

export const sendCodeToPersonalEmail = async (personalEmail) => {
    const res = await axios.post(`${API_URL}/user/sendcode/personalemail`, {
        personalEmail,
    })
    return res
}

export const sendCodeToPlatformEmail = async (
    personalEmail,
    platformEmail,
    spotifyData,
) => {
    const res = await axios.post(`${API_URL}/user/sendcode/platformemail`, {
        personalEmail,
        platformEmail,
        spotifyData,
    })
    return res
}

export const checkPersonalCode = async (
    personalEmail: string,
    personalCode: string,
) => {
    const res = await axios.post(`${API_URL}/user/check-personalcode`, {
        personalEmail,
        personalCode,
    })
    return res
}

export const checkPlatformCode = async (
    platformEmail: string,
    platformCode: string,
    accountAddress: string,
) => {
    const res = await axios.post(`${API_URL}/user/check-platformcode`, {
        platformEmail,
        platformCode,
        accountAddress,
    })
    return res
}

export const resendEmail = async (email: string) => {
    const res = await axios.post(`${API_URL}/user/resend-email`, { email })
    return res
}

export const signUpAsBuyer = async (
    personalEmail: string,
    accountAddress: string,
) => {
    const res = await axios.post(`${API_URL}/user/signup-buyer`, {
        personalEmail,
        accountAddress,
    })
    return res
}

export const signUpAsSeller = async (
    platformEmail: string,
    walletAddress: string,
) => {
    const res = await axios.post(`${API_URL}/user/signup-seller`, {
        platformEmail,
        walletAddress,
    })
    return res
}

export const spotifyLogin = async (token: string) => {
    const userRes = await axios({
        url: `https://api.spotify.com/v1/me`,
        method: 'get',
        headers: {
            Authorization: 'Bearer ' + token,
        },
    })
    return userRes
}

export const saveProfileSettings = async (id, email, notificationSettings) => {
    const res = await axios.post(`${API_URL}/user/save-profile-setting`, {
        id,
        email,
        notificationSettings,
    })
    return res
}

export const getContactInfoOfOffer = async (accountAddress: string) => {
    try {
        const res = await axios.get(`${API_URL}/user/contact/${accountAddress}`)
        return res
    } catch (e) {
        console.error('GetUser Error', e)
        return null
    }
}

export const checkIfLiked = async (
    accountAddress: string,
    listedId: number,
) => {
    try {
        const res = await axios.post(`${API_URL}/user/favorite`, {
            accountAddress,
            listedId,
        })
        return res
    } catch (e) {
        console.error('checkIfLiked Error', e)
        return null
    }
}

export const likeOrDislikeLicense = async (
    accountAddress: string,
    listedId: number,
) => {
    try {
        const res = await axios.post(`${API_URL}/user/likeOrDislike`, {
            accountAddress,
            listedId,
        })
        return res
    } catch (e) {
        console.error('likeOrDislikeLicense Error', e)
        return null
    }
}

export const followArtist = async (
    sellerId: string,
    followerAddress: number,
) => {
    try {
        const res = await axios.post(`${API_URL}/user/follow`, {
            sellerId,
            followerAddress,
        })
        return res
    } catch (e) {
        console.error('follower artist Error', e)
        return null
    }
}

export const unfollow = async (
    accountAddress: string,
    followerAddress: number,
) => {
    try {
        const res = await axios.post(`${API_URL}/user/unfollow`, {
            accountAddress,
            followerAddress,
        })
        return res
    } catch (e) {
        console.error('unfollo artist Error', e)
        return null
    }
}

export const getFollower = async (accountAddress) => {
    try {
        const res = await axios.get(
            `${API_URL}/user/get-follower/${accountAddress}`,
        )
        return res
    } catch (e) {
        console.log('error in getting follower')
        return null
    }
}

export const searchArtists = async (artistName) => {
    const res = await axios.post(`${API_URL}/user/artists/search`, {
        artistName,
    })
    return res
}

export const getFavoriteLicenseIds = async (accountAddress: string) => {
    try {
        const res = await axios.get(
            `${API_URL}/user/favorite-licenses/${accountAddress}`,
        )
        return res
    } catch (e) {
        console.error('GetUser Error', e)
        return null
    }
}

export const sendVerificationCodeToSpotifyEmail = async (
    spotifyEmail,
    accountAddress,
) => {
    const res = await axios.post(`${API_URL}/user/send-code-spotify`, {
        spotifyEmail,
        accountAddress,
    })
    return res
}

export const sendVCodeToSpotifyEmail = async (
    spotifyEmail,
    accountAddress,
    spotifyData,
) => {
    const res = await axios.post(`${API_URL}/user/add/send-code-spotify`, {
        spotifyEmail,
        accountAddress,
        spotifyData,
    })
    return res
}

export const verifySpotifyEmail = async (
    spotifyEmail,
    accountAddress,
    verificationCode,
) => {
    const res = await axios.post(`${API_URL}/user/verify-spotify`, {
        spotifyEmail,
        accountAddress,
        verificationCode,
    })
    return res
}

export const confirmUpdatedEmail = async (token) => {
    try {
        const res = await axios.get(
            `${API_URL}/user/email/update-profile/${token}`,
        )
        return res
    } catch (e) {
        console.error('GetUser Error', e)
        return null
    }
}
