import { API_URL } from '../config'
import axios from 'axios'

export const reportAppealByUser = async (_claim) => {
    const res = await axios.post(`${API_URL}/report/appeal/user`, _claim)
    return res
}

export const reportBurnedLicenseByUser = async (_license) => {
    const res = await axios.post(
        `${API_URL}/report/burnedlicense/user`,
        _license,
    )
    return res
}
