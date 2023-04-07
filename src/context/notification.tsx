import React, { useReducer, useEffect } from 'react'
import { checkAuth } from '../api'
import { io } from 'socket.io-client'
import { API_URL } from '../config'
import { useSelector, useDispatch } from 'react-redux'

export const NotificationContext = React.createContext([])

const initialState = []

const reducer = (state, action) => {
    switch (action.type) {
        case 'init':
            return action.payload
        case 'add':
        case 'licenseChange':
            const notification = state.find(
                (item) =>
                    item._id === action.payload._id &&
                    item.status === action.payload.status,
            )
            if (notification) return state
            else return [...state, action.payload]
        case 'update':
            return action.payload
        default:
            return state
    }
}

const socket = io(API_URL)

export const NotificationProvider = ({ children }) => {
    const [notifications, dispatch] = useReducer(reducer, initialState)

    const authorization = useSelector(
        (state: { authorization: any }) => state.authorization,
    )
    useEffect(() => {
        checkAuth()
    }, [])

    useEffect(() => {
        const wallet = authorization?.currentUser?.walletAddress.toLowerCase()
        const artistName = authorization?.currentUser?.artistName
        if (wallet) {
            socket.emit('read-notification', {
                accountAddress: wallet,
                artistName,
            })
        }
        socket.on('initial-notifications', function (res) {
            if (res.success) {
                dispatch({ type: 'init', payload: res.data })
            }
        })

        socket.on('created-notification', function (res) {
            if (wallet === res?.accountAddress.toLowerCase()) {
                dispatch({ type: 'add', payload: res.data })
            }
        })

        socket.on('accept-offer', function (res) {
            if (wallet === res?.accountAddress.toLowerCase()) {
                dispatch({ type: 'add', payload: res.data })
            }
        })

        socket.on('deny-offer', function (res) {
            if (wallet === res?.accountAddress.toLowerCase()) {
                dispatch({ type: 'add', payload: res.data })
            }
        })

        socket.on('remove-offer', function (res) {
            if (wallet === res?.accountAddress.toLowerCase()) {
                dispatch({ type: 'add', payload: res.data })
            }
        })

        socket.on('license-changed', function (res) {
            const artist = res?.artists?.find(
                (item) => item.name === artistName,
            )
            if (artist) {
                dispatch({ type: 'licenseChange', payload: res.data })
            }
        })
    }, [authorization?.currentUser])

    return (
        <NotificationContext.Provider value={[notifications, dispatch]}>
            {children}
        </NotificationContext.Provider>
    )
}
