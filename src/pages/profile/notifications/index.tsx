import React, { useState, useEffect } from 'react'
import { Box, Grid, Typography, Tabs, Tab } from '@mui/material'
import OutlinedInput from '@mui/material/OutlinedInput'
import { makeStyles } from '@mui/styles'
import { Theme, useTheme } from '@mui/material/styles'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import SecondaryButton from '../../../components/secondary-button'
import NotificationsTable from './notificationsTable'
import Tooltip from '@mui/material/Tooltip'
import { useSelector } from 'react-redux'
import { RoleTypes } from '../../../reducers/authorizationReducer'
import { SOCIAL_MEDIA_PLATFORMS } from '../../../config'
import { getBurnedLicenses, getRecommendedLicense } from '../../../api'
import { getNotifications } from '../../../api/notification'

const useStyles = makeStyles((theme: Theme) => ({
    input: {
        height: '50px',
        width: '150px !important',
        marginRight: '20px',
        backgroundColor: theme.palette.background.default,
    },
}))

const TypeOfMedia = [
    { label: 'Music Licenses' },
    { label: 'Patent Licenses' },
    { label: 'Video Licenses' },
]

const TypeOfSale = [{ label: 'Sales' }, { label: 'Offers' }]

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 150,
        },
    },
}

export default function NotificationsPage() {
    const theme = useTheme()
    const classes = useStyles()
    const [keyword, setKeyword] = useState<string>()
    const [mediaType, setMediaType] = useState<string>(TypeOfMedia[0].label)
    const [saleType, setSaleType] = useState<string>(TypeOfSale[0].label)
    const [walletAddress, setWalletAddress] = useState<string | null>(null)
    const [artistName, setArtistName] = useState<string | null>(null)
    const [platformType, setPlatformType] = useState<string>(
        SOCIAL_MEDIA_PLATFORMS[0].label,
    )
    const [notifications, setNotifications] = useState<Array<any>>()

    const authorization = useSelector(
        (state: { authorization: any }) => state.authorization,
    )

    const isSeller =
        authorization?.currentUser?.role === RoleTypes.Seller ||
        authorization?.currentUser?.role === RoleTypes.Mixed

    const platformHandler = (event: SelectChangeEvent<typeof platformType>) => {
        const {
            target: { value },
        } = event
        setPlatformType(value)
    }

    const mediaHandler = (event: SelectChangeEvent<typeof platformType>) => {
        const {
            target: { value },
        } = event
        setMediaType(value)
    }

    const saleHandler = (event: SelectChangeEvent<typeof platformType>) => {
        const {
            target: { value },
        } = event
        setSaleType(value)
    }

    useEffect(() => {
        setWalletAddress(authorization?.currentUser?.walletAddress)
    }, [authorization?.currentUser?.walletAddress])

    useEffect(() => {
        setArtistName(authorization?.currentUser?.artistName)
    }, [authorization?.currentUser?.artistName])

    useEffect(() => {
        const init = async () => {
            const notificationRes = await getNotifications(
                walletAddress,
                artistName,
            )
            if (
                notificationRes.status === 200 &&
                notificationRes.data.success
            ) {
                setNotifications(notificationRes.data.data)
            }
        }
        if (walletAddress && walletAddress !== '') init()
    }, [walletAddress, artistName])
    return (
        <Box>
            <Box display="flex" marginTop={'20px'}>
                <Box sx={{ display: 'flex' }}>
                    {isSeller ? (
                        <>
                            <Select
                                value={mediaType}
                                onChange={mediaHandler}
                                input={
                                    <OutlinedInput
                                        sx={{
                                            width: '100%',
                                            textAlign: 'left',
                                        }}
                                    />
                                }
                                renderValue={(selected) => {
                                    return selected
                                }}
                                MenuProps={MenuProps}
                                inputProps={{ 'aria-label': 'Without label' }}
                                className={classes.input}
                            >
                                {TypeOfMedia.map((media, idx) => (
                                    <MenuItem key={idx} value={media.label}>
                                        {media.label}
                                    </MenuItem>
                                ))}
                            </Select>

                            <Select
                                value={platformType}
                                onChange={platformHandler}
                                input={
                                    <OutlinedInput
                                        sx={{
                                            width: '100%',
                                            textAlign: 'left',
                                        }}
                                    />
                                }
                                renderValue={(selected) => {
                                    return selected
                                }}
                                MenuProps={MenuProps}
                                inputProps={{ 'aria-label': 'Without label' }}
                                className={classes.input}
                            >
                                {SOCIAL_MEDIA_PLATFORMS.map((media, idx) => (
                                    <MenuItem key={idx} value={media.label}>
                                        {media.label}
                                    </MenuItem>
                                ))}
                            </Select>

                            <Select
                                value={saleType}
                                onChange={saleHandler}
                                input={
                                    <OutlinedInput
                                        sx={{
                                            width: '100%',
                                            textAlign: 'left',
                                        }}
                                    />
                                }
                                renderValue={(selected) => {
                                    return selected
                                }}
                                MenuProps={MenuProps}
                                inputProps={{ 'aria-label': 'Without label' }}
                                className={classes.input}
                            >
                                {TypeOfSale.map((media, idx) => (
                                    <MenuItem key={idx} value={media.label}>
                                        {media.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </>
                    ) : (
                        <>
                            <Tooltip title="Licenses">
                                <SecondaryButton sx={{ maxWidth: '250px' }}>
                                    <Typography
                                        style={{
                                            textOverflow: 'ellipsis',
                                            overflow: 'hidden',
                                            whiteSpace: 'nowrap',
                                            color: theme.palette.secondary
                                                .contrastText,
                                        }}
                                    >
                                        Platform
                                    </Typography>
                                </SecondaryButton>
                            </Tooltip>

                            <Tooltip title="Platform">
                                <SecondaryButton
                                    sx={{
                                        maxWidth: '250px',
                                        marginLeft: '20px',
                                    }}
                                >
                                    <Typography
                                        style={{
                                            textOverflow: 'ellipsis',
                                            overflow: 'hidden',
                                            whiteSpace: 'nowrap',
                                            color: theme.palette.secondary
                                                .contrastText,
                                        }}
                                    >
                                        Offers
                                    </Typography>
                                </SecondaryButton>
                            </Tooltip>
                        </>
                    )}
                </Box>

                <Tooltip title="Can Take Action">
                    <SecondaryButton
                        sx={{ maxWidth: '250px', marginLeft: 'auto' }}
                    >
                        <Typography
                            style={{
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                color: theme.palette.secondary.contrastText,
                            }}
                        >
                            Can Take Action
                        </Typography>
                    </SecondaryButton>
                </Tooltip>
            </Box>
            <NotificationsTable notifications={notifications} />
        </Box>
    )
}
