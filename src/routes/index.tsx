import { useRoutes } from 'react-router-dom'
import React, { useEffect } from 'react'
import { LS_KEY } from '../config'
import jwtDecode from 'jwt-decode'
import toast from 'react-hot-toast'
import { EXPIRATION_TIME } from '../config'
import EditablePublicProfile from '../pages/profile/editablePublic'
import PageLayout from '../components/layout'

interface RouteProps {
    logOut: () => void
}

const ThemeRoutes = ({ logOut }: RouteProps) => {
    useEffect(() => {
        const ls = window.localStorage.getItem(LS_KEY)
        if (ls !== 'undefined' && ls) {
            const auth = ls && JSON.parse(ls)
            const decodedToken: any = jwtDecode(auth)
            const payload = decodedToken.payload

            const { loggedTime } = payload
            if (
                loggedTime * 1000 + EXPIRATION_TIME * 60 * 60 * 1000 <
                Date.now()
            ) {
                toast.error('Logged out. Please login again.')
                logOut()
            }
        }
    }, [logOut])

    return useRoutes([
        {
            path: '/edit-public-profile',
            element: (
                <PageLayout>
                    <EditablePublicProfile />
                </PageLayout>
            ),
        },
        {
            path: '/edit-public-profile/instagram-auth',
            element: (
                <PageLayout>
                    <EditablePublicProfile />
                </PageLayout>
            ),
        },
        {
            path: '/edit-public-profile/twitch-auth',
            element: (
                <PageLayout>
                    <EditablePublicProfile />
                </PageLayout>
            ),
        },
    ])
}

export default ThemeRoutes
