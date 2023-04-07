import { API_URL } from '../config'
import axios from 'axios'

export const getPlayLists = async (
    mediaName: string,
    accountAddress: string,
) => {
    const res = await axios.get(
        `${API_URL}/user/${mediaName.toLowerCase()}/${accountAddress}`,
    )
    return res
}

export const getAlbumsOfArtist = async (
    mediaName,
    accountAddress,
    pageNumber,
) => {
    const res = await axios.post(`${API_URL}/spotify/artist-album`, {
        mediaName,
        accountAddress,
        pageNumber,
    })
    return res
}

export const getSongsOfAlbum = async (albumId: string, pageNumber: number) => {
    const res = await axios.post(`${API_URL}/spotify/album-song`, {
        albumId,
        pageNumber,
    })
    return res
}

export const searchTracks = async (trackName, artistId) => {
    const res = await axios.get(
        `${API_URL}/spotify/search-track/${trackName}/${artistId}`,
    )
    return res?.data
}

export const getMusicFromSpotify = async (trackId) => {
    const res = await axios.get(`${API_URL}/spotify/download/${trackId}`)
    return res?.data
}

export const getPlaylistsByOrg = async (orgName, page, licenseName) => {
    const res = await axios.get(
        `${API_URL}/spotify/org/playlists/${orgName}/${page}/${licenseName}`,
    )
    return res?.data
}

export const searchByMulti = async (data) => {
    const res = await axios.post(`${API_URL}/spotify/filter`, data)
    if (res.status === 200) {
        return res.data
    } else {
        return []
    }
}
