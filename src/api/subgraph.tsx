import axios from 'axios'
import { THEGRAPH_NFT_URL } from '../config'
export const getSoldLicenseHistory = async (accountAddress) => {
    const query = `
        query {
            soldLicenseCreateds {
                transactionHash
                tokenURI
                tokenId
                seller
                price
                owner
                id
                blockTimestamp
                blockNumber
            }
        }
    `
    try {
        const res = await axios.post(THEGRAPH_NFT_URL, { query })
        if (res.status === 200 && res.data?.data?.soldLicenseCreateds) {
            return await Promise.all(
                res.data?.data?.soldLicenseCreateds
                    .filter(
                        (item) =>
                            item.seller.toLowerCase() ===
                            accountAddress.toLowerCase(),
                    )
                    .map(async (item) => {
                        const metaDataRes = await axios.get(item.tokenURI)
                        const result = {
                            transactionHash: item.transactionHash,
                            tokenId: item.tokenId,
                            price: item.price / 10 ** 18,
                            licenseName: item.licenseName,
                            seller: item.seller,
                            artistName:
                                metaDataRes.data.metadata.properties.artistName
                                    .description,
                            id: metaDataRes.data.metadata.properties?.id
                                ?.description,
                            avatarPath:
                                metaDataRes.data.metadata.properties?.avatarPath
                                    ?.description,
                            imagePath:
                                metaDataRes.data.metadata.properties.imagePath
                                    .description,
                            artists:
                                metaDataRes.data.metadata.properties.artists
                                    ?.description,
                            trackId:
                                metaDataRes.data.metadata.properties.trackId
                                    .description,
                            preview_url: metaDataRes.data.metadata.properties
                                .preview_url
                                ? metaDataRes.data.metadata.properties
                                      .preview_url.description
                                : null,
                            tokenURI: item.tokenURI,
                        }

                        return result
                    }),
            )
        } else {
            console.log('empty license history')
            return []
        }
    } catch (e) {
        console.log('error in getting sold license history', e)
        return []
    }
}
