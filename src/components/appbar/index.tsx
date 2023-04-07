import React, { useContext, useState } from 'react'
import AppBar from '@mui/material/AppBar'
import Container from '@mui/material/Container'
import { makeStyles } from '@mui/styles'
import { Badge, Box, IconButton, Button, Typography } from '@mui/material'
import Toolbar from '@mui/material/Toolbar'
import Menu from '@mui/material/Menu'
import MenuIcon from '@mui/icons-material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { styled, alpha } from '@mui/material/styles'
import InputBase from '@mui/material/InputBase'
import SearchIcon from '@mui/icons-material/Search'
import { Theme, useTheme } from '@mui/material/styles'
import toast from 'react-hot-toast'
import { connectWallet } from '../../utils/interact'
import { ethers } from 'ethers'
import {
    getUser,
    searchArtists,
    searchNFTs,
    signout,
    verifySignature,
} from '../../api'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RoleTypes } from '../../reducers/authorizationReducer'
import OutsideDetector from '../outsideDetector'
import NotificationMenu from '../notificationMenu'
import { NotificationContext } from '../../context/notification'

const useStyles = makeStyles((theme: Theme) => ({
    appBar: {
        backgroundColor: `white !important`,
        width: '100%',
    },
    container: {
        maxWidth: '1800px !important',
    },
}))

const leftPages = [
    { label: 'Home', href: '/' },
    { label: 'Explore', href: '/explore' },
    { label: 'Records', href: '/records' },
    { label: 'Resources', href: '/resources' },
]
const rightPages = [
    { label: 'Sell', href: '/sell' },
    { label: 'Notification', href: '/notification' },
    { label: 'Profile', href: '/private' },
    { label: 'Sign Out', href: '/signout' },
]

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    color: theme.palette.secondary.main,
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}))

const StyledImg = styled('img')(({ theme }) => ({
    width: '24px',
    borderRadius: '4px',
    border: `1px solid ${theme.content.container.dark}`,
    marginRight: '10px',
}))

interface ResponsiveAppBarProps {
    setOpenSell: (boolean) => void
}

function ResponsiveAppBar({ setOpenSell }: ResponsiveAppBarProps) {
    const navigate = useNavigate()
    const classes = useStyles()
    const theme = useTheme()
    const [notifications] = useContext(NotificationContext)

    const [keyword, setKeyword] = useState<string>()
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
        null,
    )
    const [nfts, setNFTs] = useState<Array<any>>([])
    const [artists, setArtists] = useState<Array<any>>([])

    const authorization = useSelector(
        (state: { authorization: any }) => state.authorization,
    )

    const [isShowingDropBox, setShowingDropBox] = useState(false)
    const [isShowingMenu, setShowingMenu] = useState(false)

    const isSeller =
        authorization?.currentUser?.role === RoleTypes.Seller ||
        authorization?.currentUser?.role === RoleTypes.Mixed

    // notification
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

    const toggleNotificationCenter = (event: React.MouseEvent<HTMLElement>) => {
        if (isShowingMenu) {
            setAnchorEl(null)
        } else {
            setAnchorEl(event.currentTarget)
        }
        setShowingMenu(!isShowingMenu)
    }

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget)
    }

    const connectWalletPressed = async () => {
        const toastConnectWallet = toast.loading('Logging in...')
        try {
            const walletResponse = await connectWallet()
            if (walletResponse.address === '') {
                toast.error(walletResponse.status, { id: toastConnectWallet })
                return false
            }
            const accountAddress = ethers.utils.getAddress(
                walletResponse.address,
            )
            const getUserResponse = await getUser(accountAddress)

            if (getUserResponse.data.success) {
                if (getUserResponse.data.data) {
                    // Popup MetaMask confirmation modal to sign message
                    const provider = new ethers.providers.Web3Provider(
                        window.ethereum,
                    )
                    const signer = provider.getSigner()
                    try {
                        let signature
                        try {
                            signature = await signer.signMessage(
                                `I am signing my one-time nonce: ${getUserResponse.data.data.nonce}`,
                            )
                        } catch (error) {
                            console.error('error in signMessage', error)
                            toast.error(error.message, {
                                id: toastConnectWallet,
                            })
                        }
                        const verifySignatureResponse = await verifySignature({
                            accountAddress: await signer.getAddress(),
                            signature,
                        })
                        if (verifySignatureResponse.success) {
                            toast.success('Successfully logged in.', {
                                id: toastConnectWallet,
                            })
                            navigate('/')
                            return true
                        } else {
                            toast.error('Error while verifying the signature', {
                                id: toastConnectWallet,
                            })
                            return false
                        }
                    } catch (error) {
                        console.error(
                            'Error while verifying the signature',
                            error,
                        )
                        toast.error('Error while verifying the signature', {
                            id: toastConnectWallet,
                        })
                        return false
                    }
                } else {
                    toast.error(
                        'You are not on our list, please register first',
                        {
                            id: toastConnectWallet,
                        },
                    )
                    navigate('/register')
                    return false
                }
            } else {
                if (getUserResponse.data.msg === 'User Not Found') {
                    toast.error(
                        'You are not on our list, please register first',
                        {
                            id: toastConnectWallet,
                        },
                    )
                    // user not found, redirects to signup page
                    navigate('/register')
                } else {
                    toast.error(getUserResponse.data.msg, {
                        id: toastConnectWallet,
                    })
                }
                return false
            }
        } catch (error) {
            console.error('connectWallet Error >> ', error)
            toast.error('Error while logging in', { id: toastConnectWallet })
            return false
        }
    }

    const hrefHandler = async (href: string) => {
        let success = false
        if (href === '/explore') {
            navigate(href)
            return
        }
        if (!authorization.loggedIn) {
            success = await connectWalletPressed()
        } else {
            success = true
        }
        if (success) {
            switch (href) {
                case '/':
                case '/explore':
                    navigate(href)
                    break
                case '/records':
                case '/resources':
                case '/sell':
                    setOpenSell(true)
                    break
                case '/notifications':
                case '/private':
                    navigate(href)
                    break
                case '/signout':
                    signout()
                    navigate('/')
                    break
                default:
                    break
            }
        }
    }

    const handleCloseNavMenu = (href: string) => {
        hrefHandler(href)
        setAnchorElNav(null)
    }

    const searchHandler = (e) => {
        const keyValue = e.target.value
        if (keyValue && keyValue.length > 3) {
            searchNFTs(keyValue).then((nftsRes) => {
                if (nftsRes.status === 200 && nftsRes.data.success) {
                    setNFTs(nftsRes.data.data)
                }
            })
            searchArtists(keyValue).then((artistsRes) => {
                if (artistsRes.status === 200 && artistsRes.data.success) {
                    setArtists(artistsRes.data.data)
                }
            })
        } else {
            if (keyValue === '') {
                setArtists([])
                setNFTs([])
            }
        }
    }

    return (
        <AppBar position="static" className={classes.appBar}>
            <Container className={classes.container}>
                <Toolbar>
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: 'flex', md: 'none' },
                        }}
                    >
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {[...leftPages, ...rightPages]
                                .filter((page) => {
                                    if (!isSeller && page.label === 'Sell') {
                                        return false
                                    } else {
                                        if (
                                            !authorization.loggedIn &&
                                            page.label === 'Sign Out'
                                        ) {
                                            return false
                                        } else {
                                            return true
                                        }
                                    }
                                })
                                .map((page, idx) => (
                                    <MenuItem
                                        key={idx}
                                        onClick={() =>
                                            handleCloseNavMenu(page.href)
                                        }
                                    >
                                        <Typography textAlign="center">
                                            {page.label}
                                        </Typography>
                                    </MenuItem>
                                ))}
                        </Menu>
                    </Box>
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: 'none', md: 'flex' },
                        }}
                    >
                        {leftPages.map((page, idx) => (
                            <Button
                                key={idx}
                                onClick={() => handleCloseNavMenu(page.href)}
                                sx={{
                                    fontSize: '16px',
                                    my: 2,
                                    mx: 1,
                                    color: 'black',
                                    display: 'block',
                                    textTransform: 'capitalize',
                                }}
                            >
                                {page.label}
                            </Button>
                        ))}
                    </Box>
                    <Box sx={{ flexGrow: 0, position: 'relative' }}>
                        <Search>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="Search…"
                                inputProps={{ 'aria-label': 'search' }}
                                onChange={(e) => searchHandler(e)}
                                onClick={() => setShowingDropBox(true)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.keyCode === 13) {
                                        const inputElement =
                                            e.target as HTMLInputElement
                                        navigate('/search', {
                                            state: {
                                                nfts,
                                                artists,
                                                keyword: inputElement.value,
                                            },
                                        })
                                    }
                                }}
                            />
                            <OutsideDetector
                                setShowingDropBox={setShowingDropBox}
                            >
                                {isShowingDropBox && (
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            width: 'calc(100% - 40px)',
                                            zIndex: 100,
                                            backgroundColor: `${theme.content.container.dark}`,
                                            padding: '20px',
                                            borderRadius: '10px',
                                        }}
                                    >
                                        <Box sx={{ marginBottom: '10px' }}>
                                            <Typography>Artists</Typography>
                                            {artists?.length > 0 ? (
                                                artists?.map((artist) => {
                                                    return (
                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                padding: '10px',
                                                                cursor: 'pointer',
                                                                '&:hover': {
                                                                    backgroundColor: `${theme.content.container.light}`,
                                                                },
                                                                borderRadius:
                                                                    '10px',
                                                            }}
                                                            onClick={() =>
                                                                navigate(
                                                                    `/view-profile/Spotify/${artist?.id}/0`,
                                                                )
                                                            }
                                                        >
                                                            <StyledImg
                                                                src={
                                                                    artist
                                                                        ?.accountData
                                                                        ?.accountData
                                                                        ?.images[0]
                                                                        ?.url
                                                                }
                                                            />
                                                            <Typography
                                                                sx={{
                                                                    width: 'calc(100% - 35px)',
                                                                    overflow:
                                                                        'hidden',
                                                                    textOverflow:
                                                                        'ellipsis',
                                                                    whiteSpace:
                                                                        'nowrap',
                                                                }}
                                                            >
                                                                {`${artist.accountName} - ${artist.accountData.platformTitle}`}
                                                            </Typography>
                                                        </Box>
                                                    )
                                                })
                                            ) : (
                                                <Typography align="center">
                                                    No Results
                                                </Typography>
                                            )}
                                        </Box>
                                        <Box>
                                            <Typography>NFTs</Typography>
                                            {nfts?.length > 0 ? (
                                                nfts?.map((nft) => {
                                                    return (
                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                padding: '10px',
                                                                cursor: 'pointer',
                                                                '&:hover': {
                                                                    backgroundColor: `${theme.content.container.light}`,
                                                                },
                                                                borderRadius:
                                                                    '10px',
                                                            }}
                                                        >
                                                            <StyledImg
                                                                src={
                                                                    nft.imagePath
                                                                }
                                                            />
                                                            <Typography
                                                                sx={{
                                                                    width: 'calc(100% - 35px)',
                                                                    overflow:
                                                                        'hidden',
                                                                    textOverflow:
                                                                        'ellipsis',
                                                                    whiteSpace:
                                                                        'nowrap',
                                                                }}
                                                            >
                                                                {
                                                                    nft.licenseName
                                                                }
                                                            </Typography>
                                                        </Box>
                                                    )
                                                })
                                            ) : (
                                                <Typography align="center">
                                                    No Results
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>
                                )}
                            </OutsideDetector>
                        </Search>
                    </Box>
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: {
                                xs: 'none',
                                md: 'flex',
                            },
                        }}
                    >
                        <Box sx={{ display: 'flex', marginLeft: 'auto' }}>
                            {rightPages
                                .filter((page) => {
                                    if (!isSeller && page.label === 'Sell') {
                                        return false
                                    } else {
                                        if (
                                            !authorization.loggedIn &&
                                            page.label === 'Sign Out'
                                        ) {
                                            return false
                                        } else {
                                            return true
                                        }
                                    }
                                })
                                .map((page, idx) => {
                                    if (page.label !== 'Notification') {
                                        return (
                                            <Button
                                                key={idx}
                                                onClick={() =>
                                                    handleCloseNavMenu(
                                                        page.href,
                                                    )
                                                }
                                                sx={{
                                                    fontSize: '16px',
                                                    my: 2,
                                                    mx: 1,
                                                    color: 'black',
                                                    display: 'block',
                                                    textTransform: 'capitalize',
                                                }}
                                            >
                                                {page.label}
                                            </Button>
                                        )
                                    } else {
                                        return (
                                            <Button
                                                key={idx}
                                                size="large"
                                                onClick={(event) => {
                                                    if (
                                                        notifications.length > 0
                                                    ) {
                                                        toggleNotificationCenter(
                                                            event,
                                                        )
                                                        handleCloseNavMenu(
                                                            page.href,
                                                        )
                                                    }
                                                }}
                                                sx={{
                                                    fontSize: '16px',
                                                    my: 2,
                                                    mx: 1,
                                                    color: 'black',
                                                    display: 'block',
                                                    textTransform: 'capitalize',
                                                }}
                                            >
                                                <Badge
                                                    badgeContent={
                                                        notifications.length
                                                    }
                                                    color="primary"
                                                >
                                                    {page.label}
                                                </Badge>
                                            </Button>
                                        )
                                    }
                                })}
                        </Box>
                    </Box>
                    <OutsideDetector setShowingDropBox={setShowingMenu}>
                        <NotificationMenu
                            open={isShowingMenu}
                            anchorEl={anchorEl}
                        />
                    </OutsideDetector>
                </Toolbar>
            </Container>
        </AppBar>
    )
}

export default ResponsiveAppBar
