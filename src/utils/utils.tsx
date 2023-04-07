import { MUMBAI_RPC_URL } from '../config'
import { ethers } from 'ethers'
import { connectWallet } from './interact'

interface ExternalAuth {
    client_id: string
    client_secret: string
    callback_url: string
}
export const Twitch: ExternalAuth = {
    client_id: '4nu0djcjtxkf8pk6di63mlqlgpjh4t',
    client_secret: 'ybdbetu4ulhhz6tbnbckvb22d24jns',
    callback_url: `${process.env.REACT_APP_HOSTING_URL}/edit-public-profile`,
}
export const Instagram: ExternalAuth = {
    client_id: '2040498642821593',
    client_secret: '07fd638959f54656f00f2f71d9dee9ce',
    callback_url: `${process.env.REACT_APP_HOSTING_URL}/edit-public-profile`,
}
export const truncateAddress = (address) => {
    const length = address.length
    return address.substr(0, 6) + '...' + address.substr(length - 4, length)
}

export const getAccountAddress = async () => {
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        // const mumbaiRpcUrl = MUMBAI_RPC_URL;
        // const provider = new ethers.providers.JsonRpcProvider(mumbaiRpcUrl);
        const signer = provider.getSigner()
        const accountAddress = await signer.getAddress()
        return accountAddress
    } catch (error) {
        console.error(error)
        return null
    }
}

export const switchNetwork = async () => {
    if (window.ethereum) {
        // if Metamask is installed
        try {
            // check if the chain to connect to is installed
            // toast.success("Please switch to Mumbai net");
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x13881' }], // chainId of Mumbai testnet
            })
        } catch (error) {
            // This error code indicates that the chain has not been added to MetaMask
            // if it is not, then install it into the user MetaMask
            if (error.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                            {
                                chainId: '0x13881',
                                rpcUrl: MUMBAI_RPC_URL,
                            },
                        ],
                    })
                    // _call function
                } catch (addError) {
                    console.error(addError)
                }
            }
            console.error(error)
        }
    } else {
        // if Metamask is not installed, ask the user to install it
        alert(
            'MetaMask is not installed. Please consider installing it: https://metamask.io/download.html',
        )
    }
}

export const getBalanceOfWallet = async () => {
    try {
        await connectWallet()
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const accountAddress = await signer.getAddress()
        const balance = await provider.getBalance(accountAddress)
        return balance
    } catch (e) {
        console.log('getBalanceOfWallet Error: ', e)
        return null
    }
}

export const randomRange = (lg: number) => {
    const results = []
    const possibleValues = Array.from({ length: lg }, (value, i) => i)

    for (let i = 0; i < lg; i += 1) {
        const possibleValuesRange = lg - (lg - possibleValues.length)
        const randomNumber = Math.floor(Math.random() * possibleValuesRange)
        const normalizedRandomNumber =
            randomNumber !== possibleValuesRange
                ? randomNumber
                : possibleValuesRange

        const [nextNumber] = possibleValues.splice(normalizedRandomNumber, 1)

        results.push(nextNumber)
    }

    return results
}
