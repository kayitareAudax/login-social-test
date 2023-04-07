import { API_URL } from '../config'
import axios from 'axios'

export const getNotifications = async (accountAddress, artistName) => {
    const res = await axios.post(`${API_URL}/notification/get`, {
        accountAddress,
        artistName,
    })
    return res
}

export const createLicenseChangeNotification = async (
    artistName,
    artists,
    listedLicenseId,
    status,
) => {
    const res = await axios.post(
        `${API_URL}/notification/create-licensechange`,
        {
            artistName,
            artists,
            listedLicenseId,
            status,
        },
    )
    return res
}

export const markAsReadNotification = async (id) => {
    const res = await axios.post(`${API_URL}/notification/mark-one`, {
        id,
    })
    return res
}

export const markAllAsReadNotification = async (accountAddress, artistName) => {
    const res = await axios.post(`${API_URL}/notification/mark-all`, {
        accountAddress,
        artistName,
    })
    return res
}

export const createExpiredNotification = async (
    accountAddress,
    listedLicenseId,
) => {
    const res = await axios.post(`${API_URL}/notification/expired-license`, {
        accountAddress,
        listedLicenseId,
    })
    return res
}
