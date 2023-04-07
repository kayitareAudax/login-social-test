import { API_URL } from '../config'
import axios from 'axios'

type MintedLicense = {
    artistName: string
    artists: Array<any>
    imagePath: string
    licenseName: string
    revenueSplits: any
    seller: string
    tokenId: number
    tokenURI: string
    trackId: string
}

type DiscountCode = {
    discountCodeName: string
    deductedRate: number
}

export const saveListedLicenses = async (
    mintedLicense: MintedLicense,
    discountCodes: Array<DiscountCode>,
) => {
    const res = await axios.post(`${API_URL}/listedlicense`, {
        mintedLicense,
        discountCodes,
    })
    return res
}

export const getGenres = async (tokenId: string) => {
    const res = await axios.get(`${API_URL}/listedlicense/genres/${tokenId}`)
    return res
}

export const searchNFTs = async (nftName) => {
    const res = await axios.post(`${API_URL}/listedlicense/nfts/search`, {
        nftName,
    })
    return res
}

export const filterNFT = async (filterType) => {
    const res = await axios.get(
        `${API_URL}/listedlicense/filter-nft/${filterType}`,
    )
    return res
}

export const getOutGoingLicenses = async (walletAddress: string) => {
    const res = await axios.get(
        `${API_URL}/listedlicense/out-going/${walletAddress}`,
    )
    return res
}

export const getInComingLicenses = async (walletAddress: string) => {
    const res = await axios.get(
        `${API_URL}/listedlicense/in-coming/${walletAddress}`,
    )
    return res
}

// export const updateRevenueSplits = async (listedId, revenueSplits) => {
//     const res = await axios.post(
//         `${API_URL}/listedlicense/update-revenuesplits`,
//         {
//             listedId,
//             revenueSplits,
//         },
//     )
//     return res
// }

export const checkduplication = async (licenseName) => {
    const res = await axios.post(`${API_URL}/listedlicense/checkduplication`, {
        licenseName,
    })
    return res
}
