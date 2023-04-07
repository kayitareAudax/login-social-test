import axios from 'axios'
import { API_URL } from '../config'

export const storeSale = async (soldLicenses, walletAddress) => {
    const res = await axios.post(`${API_URL}/soldlicense/sale`, {
        soldLicenses,
        walletAddress,
    })
    return res
}

export const getSoldLicenses = async (walletAddress) => {
    try {
        const res = await axios.get(
            `${API_URL}/soldlicense/groups/${walletAddress}`,
        )
        return res
    } catch (e) {
        console.error('get sold license Error', e)
        return null
    }
}

export const getBurnedLicenses = async (walletAddress) => {
    const res = await axios.post(`${API_URL}/soldlicense/burnedlicense`, {
        walletAddress,
    })
    return res
}

export const getTrendingArtist = async (time) => {
    const res = await axios.get(`${API_URL}/soldlicense/trending/${time}`)
    return res
}

export const getTopArtist = async (time) => {
    const res = await axios.get(`${API_URL}/soldlicense/top/${time}`)
    return res
}
