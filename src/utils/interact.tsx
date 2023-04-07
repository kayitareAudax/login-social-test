import { ethers } from 'ethers'
import { AUTHENTICATION_WALLET_CONNECTED } from '../actions/actionTypes'
import { store } from '../store'

declare global {
    interface Window {
        ethereum?: any
    }
}

export const connectWallet = async () => {
    if (window.ethereum) {
        try {
            const addressArray = await window.ethereum.request({
                method: 'eth_requestAccounts',
            })
            const obj = {
                status: '👆🏽 Wallet is connected successfully.',
                address: addressArray[0],
            }
            store.dispatch({
                type: AUTHENTICATION_WALLET_CONNECTED,
                payload: {},
            })
            return obj
        } catch (err) {
            return {
                address: '',
                status: '😥 ' + err.message,
            }
        }
    } else {
        return {
            address: '',
            status: (
                <span>
                    <p>
                        {' '}
                        🦊{' '}
                        <a
                            target="_blank"
                            rel="noreferrer"
                            href={`https://metamask.io/download.html`}
                        >
                            You must install Metamask, a virtual Ethereum
                            wallet, in your browser.
                        </a>
                    </p>
                </span>
            ),
        }
    }
}
