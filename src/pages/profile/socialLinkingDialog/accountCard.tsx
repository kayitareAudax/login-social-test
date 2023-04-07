import type { Identifier, XYCoord } from 'dnd-core'
import type { FC } from 'react'
import { useRef, useCallback, useState, useMemo, useEffect } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { Box, Button, IconButton } from '@mui/material'
import { ItemTypes } from './itemTypes'
import { Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Theme, useTheme } from '@mui/material/styles'
import OpenWithIcon from '@mui/icons-material/OpenWith'
import PrimaryButton from '../../../components/primary-button'
import SpotifyLogin from 'react-spotify-login'
import {
    SPOTIFY_CLIENT_ID,
    PROFILE_REDIRECTED_URL,
    TIME_OUT,
    GOOGLE_CLIENT_ID,
} from '../../../config'
import { toast } from 'react-hot-toast'
import { AccountTypes } from '.'
import { spotifyLogin } from '../../../api'
import { gapi, loadAuth2 } from 'gapi-script'
import WebSiteLinkDialog from './websiteLinkingDialog'
import { Instagram, Twitch } from '../../../utils/utils'

const DISCOVERY_DOCS = [
    'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest',
]
const SCOPES = 'https://www.googleapis.com/auth/youtube.readonly'

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        padding: '10px 0px',
    },
    spotifyButton: {
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.primary.contrastText,
        width: '40%',
        height: '50px',
        padding: '6px 8px',
        outline: 0,
        border: 0,
        marginLeft: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textTransform: 'capitalize',
        borderRadius: '4px',
        position: 'relative',
        boxSizing: 'border-box',
        cursor: 'pointer',
        transition:
            'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        '&:hover': {
            backgroundColor: theme.palette.primary.main,
            textDecoration: 'none',
        },
        '&.Mui-disabled': {
            backgroundColor: theme.palette.primary.dark,
        },
    },
}))

export interface AccountCardProps {
    id: any
    text: string
    isLinked: boolean
    type: AccountTypes
    index: number
    cards: any
    moveCard: (dragIndex: number, hoverIndex: number) => void
    setCards: (cards: Array<any>) => void
}

interface DragItem {
    index: number
    id: string
    type: string
}

export const AccountCard: FC<AccountCardProps> = ({
    id,
    text,
    isLinked,
    type,
    index,
    cards,
    moveCard,
    setCards,
}) => {
    const classes = useStyles()
    const ref = useRef<HTMLDivElement>(null)
    const [startedTime, setStartedTime] = useState<number | undefined>(0)
    const [googleAuth, setGoogleAuth] = useState(null)
    const [openWebsiteLinkDlg, setOpenWebsiteLinkDlg] = useState<boolean>(false)

    const [{ handlerId }, drop] = useDrop<
        DragItem,
        void,
        { handlerId: Identifier | null }
    >({
        accept: ItemTypes.CARD,
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            }
        },
        hover(item: DragItem, monitor) {
            if (!ref.current) {
                return
            }
            const dragIndex = item.index
            const hoverIndex = index

            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return
            }

            // Determine rectangle on screen
            const hoverBoundingRect = ref.current?.getBoundingClientRect()

            // Get vertical middle
            const hoverMiddleY =
                (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

            // Determine mouse position
            const clientOffset = monitor.getClientOffset()

            // Get pixels to the top
            const hoverClientY =
                (clientOffset as XYCoord).y - hoverBoundingRect.top

            // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%

            // Dragging downwards
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return
            }

            // Dragging upwards
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return
            }

            // Time to actually perform the action
            moveCard(dragIndex, hoverIndex)

            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            item.index = hoverIndex
        },
    })

    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.CARD,
        item: () => {
            return { id, index }
        },
        collect: (monitor: any) => ({
            isDragging: monitor.isDragging(),
        }),
    })

    drag(drop(ref))

    const signInHandler = useCallback(
        async (token: string) => {
            if (token && token !== '') {
                const userRes = await spotifyLogin(token)
                if (userRes?.data) {
                    let tmp = cards
                    tmp = tmp.map((item) => {
                        if (item.type === AccountTypes.Spotify) {
                            return {
                                ...item,
                                accountData: userRes?.data,
                                isLinked: true,
                            }
                        } else {
                            return item
                        }
                    })
                    setCards(tmp)
                } else {
                    console.log('spotify sign in error')
                    toast.error('Something went wrong. Please try again')
                }
            } else {
                toast.error('Invalid token. Please try again')
            }
        },
        [cards, setCards],
    )

    const onFailure = useCallback((response) => console.error(response), [])

    const onSuccess = useCallback(
        (response) => {
            const endTime = Math.floor(Date.now() / 1000)
            if (endTime > startedTime + TIME_OUT * 60) {
                toast.error('Your token is expired. Please try again')
            } else {
                signInHandler(response.access_token)
            }
        },
        [startedTime, signInHandler],
    )
    const getChannels = () => {
        return gapi.client.youtube.channels
            .list({
                part: ['snippet'],
                mine: true,
                maxResults: 25,
            })
            .then(
                function (response) {
                    const items = response.result.items
                    console.log('youtube-channel', items)
                },
                function (err) {
                    console.error('Execute error', err)
                },
            )
    }
    const updateUser = useCallback(
        async (currentUser) => {
            const gmail = currentUser.getBasicProfile().getEmail()
            const name = currentUser.getBasicProfile().getName()
            const profileImg = currentUser.getBasicProfile().getImageUrl()
            setGoogleAuth({
                gmail,
                name,
                profileImg,
            })
            await getChannels()
            let tmp = cards
            tmp = tmp.map((item) => {
                if (item.type === AccountTypes.YouTube) {
                    return {
                        ...item,
                        accountData: { gmail, name, profileImg },
                        isLinked: true,
                    }
                } else {
                    return item
                }
            })
            setCards(tmp)
        },
        [cards, setCards],
    )

    const attachSignin = useCallback(
        (element, auth2) => {
            auth2.attachClickHandler(element, {}, (googleUser) => {
                updateUser(googleUser)
            })
        },
        [updateUser],
    )

    // useEffect(() => {
    //     const setAuth2 = async () => {
    //         const auth2 = await loadAuth2(gapi, GOOGLE_CLIENT_ID, '')
    //         if (!auth2.isSignedIn.get()) {
    //             attachSignin(document.getElementById('youtube-auth'), auth2)
    //         } else {
    //             updateUser(auth2.currentUser.get())
    //         }
    //     }
    //     setAuth2()
    // }, [attachSignin, updateUser])

    useEffect(() => {
        const setAuth2 = async () => {
            const auth2 = await loadAuth2(gapi, GOOGLE_CLIENT_ID, '')
            attachSignin(document.getElementById('youtube-auth'), auth2)
        }

        const initClient = () => {
            gapi.client.init({
                discoveryDocs: DISCOVERY_DOCS,
                clientId: GOOGLE_CLIENT_ID,
                scope: SCOPES,
            })
        }
        gapi.load('client:auth2', initClient)
        setAuth2()
    }, [googleAuth, attachSignin, updateUser])

    const TWITTER_CLIENT_ID = 'KKBIawUSE_OWNPJwM' // =
    function getTwitterOauthUrl() {
        const rootUrl = 'https://twitter.com/i/oauth2/authorize'
        const options = {
            redirect_uri: 'http://localhost:3000', //
            client_id: TWITTER_CLIENT_ID,
            state: 'state',
            response_type: 'code',
            code_challenge: 'y_SfRG4BmOES02uqWeIkIgLQAlTBggyf_G7uKT51ku8',
            code_challenge_method: 'S256',
            scope: [
                'users.read',
                'tweet.read',
                'follows.read',
                'follows.write',
            ].join(' '),
        }
        const qs = new URLSearchParams(options).toString()
        return window.location.assign(`${rootUrl}?${qs}`)
    }

    const twitchAuthorize = useCallback(() => {
        const rootUrl = 'https://id.twitch.tv/oauth2/authorize'
        const options = {
            redirect_uri: Twitch.callback_url,
            client_id: Twitch.client_id,
            state: 'state',
            response_type: 'code',
            code_challenge: 'y_SfRG4BmOES02uqWeIkIgLQAlTBggyf_G7uKT51ku8',
            code_challenge_method: 'S256',
            scope: ['user:read:email'].join(' '),
        }
        const qs = new URLSearchParams(options).toString()
        if (window.location.assign(`${rootUrl}?${qs}`) != null) {
            alert('Redirecting ..... ')
        }
    }, [])

    const authInstagram = useCallback(() => {
        const clientID = Instagram.client_id
        const redirectURI = Instagram.callback_url
        const responseType = 'code'
        const scope = 'user_profile user_media'
        const url = `https://www.instagram.com/oauth/authorize?app_id=${clientID}&redirect_uri=${redirectURI}&scope=${scope}&response_type=${responseType}&instagram_auth=true`
        return window.location.assign(url)
    }, [])

    const linkHandler = useCallback(
        (accounType: AccountTypes) => {
            switch (accounType) {
                case AccountTypes.Instagram:
                    authInstagram()
                    break
                case AccountTypes.Twitch:
                    twitchAuthorize()
                    break
                case AccountTypes.Twitter:
                    getTwitterOauthUrl()
                    break
                case AccountTypes.Spotify:
                    break
                case AccountTypes.Website:
                    setOpenWebsiteLinkDlg(true)
                    break
                case AccountTypes.Twitch:
                    break
                default:
                    break
            }
        },
        [twitchAuthorize, authInstagram],
    )

    const LinkButton = useMemo(() => {
        let btnObj = null

        switch (type) {
            case AccountTypes.Spotify:
                btnObj = (
                    <SpotifyLogin
                        clientId={SPOTIFY_CLIENT_ID}
                        redirectUri={PROFILE_REDIRECTED_URL}
                        scope="user-read-email"
                        onSuccess={onSuccess}
                        onFailure={onFailure}
                        className={classes.spotifyButton}
                        onRequest={() =>
                            setStartedTime(Math.floor(Date.now() / 1000))
                        }
                    >
                        Link
                    </SpotifyLogin>
                )
                break
            case AccountTypes.Instagram:
            case AccountTypes.Twitch:
            case AccountTypes.Twitter:
            case AccountTypes.Website:
                btnObj = (
                    <PrimaryButton
                        sx={{ width: '40% !important', marginLeft: 'auto' }}
                        onClick={() => linkHandler(type)}
                    >
                        {type === AccountTypes.Website ? 'Enter Link' : 'Link'}
                    </PrimaryButton>
                )
                break
            case AccountTypes.YouTube:
                btnObj = (
                    <Box id="youtube-auth" className={classes.spotifyButton}>
                        Link
                    </Box>
                )
                break
            default:
                break
        }
        return btnObj
    }, [
        onSuccess,
        onFailure,
        setStartedTime,
        type,
        classes.spotifyButton,
        linkHandler,
    ])

    const websiteLinkingHandler = (websiteLink: string) => {
        setOpenWebsiteLinkDlg(false)
        let tmp = cards
        tmp = tmp.map((item) => {
            if (item.type === AccountTypes.Website) {
                return { ...item, accountData: websiteLink, isLinked: true }
            } else {
                return item
            }
        })
        setCards(tmp)
    }

    const disconnectHandler = () => {
        let tmp = cards
        tmp = tmp.map((item) => {
            if (item.type === type) {
                return {
                    ...item,
                    accountData: null,
                    isLinked: false,
                }
            } else {
                return item
            }
        })
        setCards(tmp)
    }

    return (
        <Box className={classes.root}>
            <Box display={'flex'} alignItems="center">
                <Box
                    ref={ref}
                    data-handler-id={handlerId}
                    sx={{ cursor: 'move' }}
                >
                    <IconButton>
                        <OpenWithIcon />
                    </IconButton>
                </Box>

                <Typography sx={{ marginLeft: '20px' }}>{text}</Typography>
            </Box>
            {isLinked ? (
                <Button
                    variant="contained"
                    color="error"
                    sx={{
                        marginLeft: 'auto',
                        textTransform: 'capitalize',
                        width: '40%',
                        height: '50px',
                    }}
                    onClick={() => disconnectHandler()}
                >
                    Disconnect
                </Button>
            ) : (
                <>{LinkButton}</>
            )}
            <WebSiteLinkDialog
                open={openWebsiteLinkDlg}
                setOpen={setOpenWebsiteLinkDlg}
                handler={websiteLinkingHandler}
            />
        </Box>
    )
}
