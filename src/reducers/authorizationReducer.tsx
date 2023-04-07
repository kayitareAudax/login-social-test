import {
    AUTH_INITIALIZATION,
    AUTHENTICATED,
    AUTHENTICATION_EXPIRED,
    NOT_AUTHENTICATED,
    WALLETADDRESS_CHANGED,
    AUTHENTICATION_WALLET_CONNECTED,
} from '../actions/actionTypes'

export type AuthType = {
    authChecked: boolean
    loggedIn: boolean
    isExpired: boolean
    walletConnected: boolean
    currentUser: {
        id: string
        walletAddress: string
        artistName: string
        artistId: string
        role: number
        shutDownStatus: any
    }
}

export enum RoleTypes {
    None = -1,
    Buyer = 0,
    Seller = 1,
    Mixed = 2,
}

const initialState = {
    authChecked: false,
    loggedIn: false,
    isExpired: false,
    walletConnected: false,
    currentUser: {
        id: '',
        walletAddress: '',
        artistName: '',
        artistId: '',
        role: RoleTypes.None,
        shutDownStatus: null,
    },
}

export default function authorization(
    state: AuthType = initialState,
    action = { type: AUTH_INITIALIZATION, payload: { walletAddress: null } },
) {
    switch (action.type) {
        case AUTH_INITIALIZATION:
            return state
        case AUTHENTICATED:
            return {
                authChecked: true,
                loggedIn: true,
                currentUser: action.payload,
            }
        case WALLETADDRESS_CHANGED:
            if (state.loggedIn) {
                return {
                    ...state,
                    walletAddress: action.payload.walletAddress,
                }
            }
            return state
        case NOT_AUTHENTICATED:
        case AUTHENTICATION_EXPIRED:
            return {
                authChecked: true,
                loggedIn: false,
                currentUser: initialState.currentUser,
            }
        case AUTHENTICATION_WALLET_CONNECTED:
            return {
                ...state,
                walletConnected: true,
            }
        default:
            return state
    }
}
