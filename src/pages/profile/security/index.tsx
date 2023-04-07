import { Box, Button, Typography } from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { useEffect, useState } from 'react'
import { totalPlatforms } from '../../../config'
import OutlinedInput from '@mui/material/OutlinedInput'
import { useTheme } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import { ContainerFluid } from '../style'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getCurrentAccount } from '../../../api'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
}

export default function ProfileSecurityPage() {
    const theme = useTheme()
    const navigate = useNavigate()
    const [mediaName, setMediaName] = useState<string>(totalPlatforms[0])
    const [currentAccount, setCurrentAccount] = useState<any>()

    const authorization = useSelector(
        (state: { authorization: any }) => state.authorization,
    )

    const mediaHandler = async (event: SelectChangeEvent<typeof mediaName>) => {
        const {
            target: { value },
        } = event
        setMediaName(value)
        try {
            const currentRes = await getCurrentAccount(
                value,
                authorization?.currentUser?.walletAddress,
            )
            if (currentRes.status === 200 && currentRes.data.success) {
                setCurrentAccount(currentRes.data.data)
            }
        } catch (e) {
            console.log('error in getting accounts', e)
        }
    }

    useEffect(() => {
        const init = async () => {
            try {
                if (mediaName && authorization?.currentUser?.walletAddress) {
                    const currentRes = await getCurrentAccount(
                        mediaName,
                        authorization?.currentUser?.walletAddress,
                    )
                    if (currentRes.status === 200 && currentRes.data.success) {
                        setCurrentAccount(currentRes.data.data)
                    }
                }
            } catch (e) {
                console.log('error in getting current user account', e)
            }
        }
        init()
    }, [mediaName, authorization?.currentUser?.walletAddress])

    return (
        <ContainerFluid sx={{ minHeight: '100vh' }}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    paddingTop: '20px',
                    marginBottom: '50px',
                }}
            >
                <Select
                    value={mediaName}
                    onChange={mediaHandler}
                    input={
                        <OutlinedInput
                            sx={{ width: '80%', marginLeft: 'auto' }}
                        />
                    }
                    renderValue={(selected) => {
                        return selected
                    }}
                    MenuProps={MenuProps}
                    inputProps={{ 'aria-label': 'Without label' }}
                    sx={{
                        width: '300px',
                        backgroundColor: theme.palette.background.default,
                    }}
                >
                    {totalPlatforms.map((platform, idx) => (
                        <MenuItem key={idx} value={platform}>
                            {`${platform}`}
                        </MenuItem>
                    ))}
                </Select>
            </Box>

            {currentAccount ? (
                currentAccount?.map((current) => {
                    return (
                        <Box sx={{ margin: '20px 0px' }}>
                            <Typography
                                sx={{
                                    backgroundColor:
                                        theme.content.container.dark,
                                    padding: '8px',
                                    borderRadius: '2px',
                                }}
                                component="span"
                            >
                                @{current?.account}
                            </Typography>

                            <Typography
                                sx={{ padding: '30px 0px' }}
                            >{`${current?.accounts?.length} Accounts Using This Account`}</Typography>

                            <Box
                                sx={{
                                    marginTop: '20px',
                                    padding: '20px',
                                    backgroundColor:
                                        theme.content.container.dark,
                                    borderRadius: '6px',
                                }}
                            >
                                <Typography align="center">
                                    Wallet IDs
                                </Typography>
                                {current?.accounts.map((item, idx) => {
                                    return (
                                        <Typography
                                            sx={{ padding: '4px' }}
                                            key={idx}
                                        >
                                            {item.accountAddress}
                                        </Typography>
                                    )
                                })}
                                <Typography
                                    sx={{ padding: '4px' }}
                                    align="center"
                                >
                                    If Anything Looks Suspicious Consider
                                    Changing the Password of This Spotify
                                    Account
                                </Typography>
                            </Box>
                        </Box>
                    )
                })
            ) : (
                <Typography variant="h6" align="center">
                    There is no duplicated account
                </Typography>
            )}
            <Button
                variant="contained"
                color="error"
                sx={{
                    textTransform: 'capitalize',
                    width: '200px',
                    height: '50px',
                    marginTop: '50px',
                }}
                onClick={() => navigate(-1)}
            >
                Back
            </Button>
        </ContainerFluid>
    )
}
