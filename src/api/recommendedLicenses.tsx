import { API_URL } from '../config'
import axios from 'axios'

export const getRecommendedLicense = async (walletAddress) => {
    const res = await axios.get(
        `${API_URL}/listedlicense/recommended/${walletAddress}`,
    )
    return res
}

export const deleteRecommendedLicense = async (_data) => {
    const res = await axios.post(
        `${API_URL}/soldlicense/recommendedlicense`,
        _data,
    )
    return res
}
