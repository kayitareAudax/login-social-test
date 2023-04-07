import { ReactComponent as TwitterIcon } from './assets/twitter.svg'
import { ReactComponent as YoutubeIcon } from './assets/youtube.svg'
import { ReactComponent as TwitchIcon } from './assets/twitch.svg'
import { ReactComponent as InstagramIcon } from './assets/instagram.svg'
import { ReactComponent as SpotifyIcon } from './assets/spotify.svg'

export const mumbaiTxScan = 'https://mumbai.polygonscan.com/tx'
export const mumbaiTokenScan = 'https://mumbai.polygonscan.com/token'

export const API_URL = 'http://localhost:8080'

export const AUTH_REDIRECTED_URL =
    process.env.NODE_ENV === 'production'
        ? `${process.env.REACT_APP_HOSTING_URL}/register`
        : 'http://localhost:3000/register'

export const ACCOUNT_SETTING_REDIRECTED_URL =
    process.env.NODE_ENV === 'production'
        ? `${process.env.REACT_APP_HOSTING_URL}/account-center`
        : 'http://localhost:3000/account-center'

export const WITHDRAW_REDIRECTED_URL =
    process.env.NODE_ENV === 'production'
        ? `${process.env.REACT_APP_HOSTING_URL}/private`
        : 'http://localhost:3000/private'

export const PROFILE_REDIRECTED_URL =
    process.env.NODE_ENV === 'production'
        ? `${process.env.REACT_APP_HOSTING_URL}/edit-public-profile`
        : 'http://localhost:3000/edit-public-profile'

export const CLIENT_URL =
    process.env.NODE_ENV === 'production'
        ? `${process.env.REACT_APP_HOSTING_URL}`
        : 'http://localhost:3000'

export const SPOTIFY_CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID
export const MUMBAI_RPC_URL = process.env.REACT_APP_MUMBAI_RPC_URL
export const IPFS_METADATA_API_URL = process.env.REACT_APP_OUR_IPFS_METADATA
export const IPFS_NFT_API_URL = process.env.REACT_APP_OUR_IPFS_NFT
export const marketplaceAddress = process.env.REACT_APP_MARKETPLACE_ADDRESS
export const nftAddress = process.env.REACT_APP_NFT_ADDRESS
export const socialMediaAddress = process.env.REACT_APP_SOCIALMEDIA_ADDRESS
export const LS_KEY = 'login-with-metamask:auth'
export const ADDED_LICENSES = 'added-licenses'
export const REPORT_KEY = 'wallet-address:report'
export const TAB_KEY = 'profile-tab'
export const TIME_OUT = 30 //30 mins
export const EXPIRATION_TIME = 48 //48 hours
export const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID
export const PUBLIC_KEY = process.env.REACT_APP_PUBLIC_KEY
export const THEGRAPH_NFT_MARKETPLACE_URL =
    process.env.REACT_APP_THEGRAPH_NFT_MARKETPLACE_URL
export const THEGRAPH_NFT_URL = process.env.REACT_APP_THEGRAPH_NFT_URL

export const MEDIA_PLATFORM_TYPES = [
    {
        label: 'Spotify',
        pID: 0,
        icon: <SpotifyIcon style={{ width: 64, height: 64 }} />,
    },
    {
        label: 'USPTO',
        pID: 1,
        icon: <TwitchIcon style={{ width: 64, height: 64 }} />,
    },
]

export const SOCIAL_MEDIA_PLATFORMS = [
    {
        label: 'Youtube',
    },
    {
        label: 'Twitter',
    },
    {
        label: 'Twitch',
    },
    {
        label: 'Instagram',
    },
]

export const RECORDLABEL_OPTIONS = [
    'Sony Music',
    'Warner Music',
    'Universal Music',
]

export enum SectionTypes {
    None = -1,
    AddLicenseShowcaseSection,
    AddImageSection,
    AddMusicPreviewSection,
    AddDescriptionSection,
    AddVideoSection,
    AddAccountSection,
}

export enum SizeTypes {
    None = -1,
    Large = 0,
    Medium,
    Small,
}

export enum LicenseChangeTypes {
    Listing = 0,
    Adjust = 1,
    Approved = 2,
    Rejected = 3,
    Unlisted = 4,
}

export enum LicenseStatus {
    Pending = 0,
    Approved = 1,
    Rejected = 2,
}

export const totalPlatforms = [
    'Spotify',
    'USPTO',
    'Apple Music',
    'CruncyRoll',
    'Twitter',
    'YouTube',
    'Instagram',
    'Twitch',
    'Linkedin',
    'TikTok',
    'Facebook',
    'Roblox',
]
