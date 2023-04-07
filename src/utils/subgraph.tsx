import axios from 'axios'
import { THEGRAPH_NFT_MARKETPLACE_URL, THEGRAPH_NFT_URL } from '../config'

const marketplaceBlockNumber = '33729300'
const nftBlockNumber = '33729286'
const historyQuery1 = (blockNumber, listedId) => {
    return `
      query {
          listedLicenseRemoveds(
            where: {listedLicenseId: ${listedId}, _change_block: {number_gte: ${blockNumber}}}
            orderBy: blockNumber
          ) {
            blockNumber
            blockTimestamp
            id
            listedLicenseId
            seller
            transactionHash
          }
          offerCreateds(where: {listedLicenseId: ${listedId}, _change_block: {number_gte: ${blockNumber}}}, orderBy: blockNumber) {
            _buyer
            _seller
            blockNumber
            blockTimestamp
            id
            listedLicenseId
            offerId
            offerPrice
            status
            transactionHash
          }
          listedLicenseCreateds(
            orderBy: blockNumber
            where: {listedLicenseId: ${listedId}, _change_block: {number_gte: ${blockNumber}}}
          ) {
            id
            listedLicenseId
            price
            recommendedPrice
            listedTime
            seller
            tokenURI
            transactionHash
            blockTimestamp
            blockNumber
            bidCount
          }
          listedLicenseChangeds(
            orderBy: blockNumber
            where: {listedLicenseId: ${listedId}, _change_block: {number_gte: ${blockNumber}}}
          ) {
            id
            listedLicenseId
            seller
            blockNumber
            blockTimestamp
            transactionHash
          }
      }
  `
}

const historyQuery2 = (blockNumber, listedId) => {
    return `
      query {
          soldLicenseCreateds(
            orderBy: blockNumber
            where: {listedLicenseId: ${listedId}, _change_block: {number_gte: ${blockNumber}}}
          ) {
            blockNumber
            blockTimestamp
            id
            listedLicenseId
            owner
            price
            saleType
            seller
            tokenId
            tokenURI
            transactionHash
          }
      }
  `
}

export const getListedHistoryFromTheGraph = async (listedId) => {
    const res = await axios({
        url: THEGRAPH_NFT_MARKETPLACE_URL,
        method: 'post',
        data: { query: historyQuery1(marketplaceBlockNumber, listedId) },
    })

    if (res.status === 200) {
        return res.data.data
    } else {
        return []
    }
}

export const getSoldHistoryFromTheGraph = async (listedId) => {
    const res = await axios({
        url: THEGRAPH_NFT_URL,
        method: 'post',
        data: { query: historyQuery2(nftBlockNumber, listedId) },
    })
    if (res.status === 200) {
        return res.data.data
    } else {
        return []
    }
}
