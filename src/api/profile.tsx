import axios from 'axios'
import { API_URL } from '../config'

export const savePublicProfile = async (
    accountId,
    accountType,
    profileData,
) => {
    const res = await axios.post(`${API_URL}/user/save-profile`, {
        accountId,
        accountType,
        profileData,
    })

    return res
}

export const publishPublicProfile = async (accountId, accountType) => {
    const res = await axios.post(`${API_URL}/user/publish-profile`, {
        accountId,
        accountType,
    })
    return res
}

export const unPublishPublicProfile = async (accountId, accountType) => {
    const res = await axios.post(`${API_URL}/user/unpublish-profile`, {
        accountId,
        accountType,
    })
    return res
}

export const getPublicProfile = async (accountId, accountType) => {
    const res = await axios.get(
        `${API_URL}/user/get-profile/${accountId}/${accountType}`,
    )

    return res
}

export const uploadProfileImage = async (image, accountId, accountType) => {
    const formData = new FormData()
    formData.append('image', image)
    formData.append(`accountId`, accountId)
    formData.append(`accountType`, accountType)

    const resFile = await axios({
        method: 'post',
        url: `${API_URL}/user/upload-profile-image`,
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
    return resFile
}

export const saveContactInfo = async (
    id: string,
    phoneNumber: string,
    showPhoneNumber: boolean,
    contactEmail: string,
    showContactEmail: boolean,
) => {
    const res = await axios.post(`${API_URL}/user/save-contactInfo`, {
        id,
        phoneNumber,
        showPhoneNumber,
        contactEmail,
        showContactEmail,
    })
    return res
}

export const updateBuyerPlatform = async (accountAddress, buyerAccountData) => {
    const res = await axios.post(`${API_URL}/user/update-buyerplatform`, {
        accountAddress,
        buyerAccountData,
    })
    return res
}

export const getBuyerPlatform = async (accountAddress) => {
    const res = await axios.get(
        `${API_URL}/user/get-buyerplatform/${accountAddress}`,
    )
    return res
}

export const getSellerPlatform = async (accountAddress) => {
    const res = await axios.get(
        `${API_URL}/user/get-sellerplatform/${accountAddress}`,
    )
    return res
}

export const updateSellerPlatform = async (
    accountAddress,
    sellerAccountData,
) => {
    const res = await axios.post(`${API_URL}/user/update-sellerplatform`, {
        accountAddress,
        sellerAccountData,
    })
    return res
}

export const getCurrentAccount = async (platformTitle, accountAddress) => {
    const res = await axios.post(`${API_URL}/user/current-account`, {
        platformTitle,
        accountAddress,
    })
    return res
}
