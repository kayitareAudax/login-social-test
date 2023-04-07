import React, { useState, useEffect, useCallback } from 'react'
import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { MEDIA_PLATFORM_TYPES } from '../../config'
import OutlinedInput from '@mui/material/OutlinedInput'
import { useTheme } from '@mui/material/styles'
import { Box, Grid, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import PrimaryButton from '../primary-button'
import { useSelector } from 'react-redux'
import ErrorButton from '../error-button'
import { getUser } from '../../api'

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
    '& .MuiPaper-root': {
        backgroundColor: theme.dialog.background,
    },
}))

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

export interface DialogTitleProps {
    id: string
    children?: React.ReactNode
    onClose: () => void
}

export interface DialogProps {
    href: string
    open: boolean
    setOpen: (open: boolean) => void
}

export default function MediasDialog({ href, open, setOpen }: DialogProps) {
    const theme = useTheme()
    const navigate = useNavigate()

    const [sellerAccountData, setSellerAccountData] = useState<Array<any>>()

    const authorization = useSelector(
        (state: { authorization: any }) => state.authorization,
    )

    const [mediaName, setMediaName] = useState<string>(
        MEDIA_PLATFORM_TYPES[0].label,
    )

    const handleClose = () => {
        setOpen(false)
    }

    const mediaHandler = (event: SelectChangeEvent<typeof mediaName>) => {
        const {
            target: { value },
        } = event
        setMediaName(value)
    }

    const nextHandler = () => {
        setOpen(false)
        navigate(href, { state: mediaName })
    }

    const init = useCallback(async () => {
        if (authorization?.currentUser?.walletAddress) {
            const userRes = await getUser(
                authorization?.currentUser?.walletAddress,
            )
            if (userRes.status && userRes.data.success) {
                setSellerAccountData(userRes.data.data.sellerAccountData)
                if (userRes?.data?.data?.sellerAccountData) {
                    const accountList =
                        userRes.data.data.sellerAccountData.filter(
                            (account) => account?.accountData,
                        )
                    setSellerAccountData(accountList)
                }
            } else {
                console.log('could not read seller account data')
            }
        }
    }, [authorization?.currentUser?.walletAddress])

    useEffect(() => {
        init()
    }, [init])

    return (
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
            maxWidth="sm"
            fullWidth={true}
        >
            <DialogContent dividers sx={{ padding: 80 }}>
                <Typography align="center" variant="h6">
                    Select IP Type
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        paddingTop: '20px',
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
                            width: '100%',
                            backgroundColor: theme.palette.background.default,
                        }}
                    >
                        {sellerAccountData?.map((account, idx) => (
                            <MenuItem key={idx} value={account.platformTitle}>
                                {`${account.platformTitle} (${account?.accountData?.id})`}
                            </MenuItem>
                        ))}
                    </Select>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        paddingTop: '20px',
                    }}
                >
                    <ErrorButton handler={() => setOpen(false)}>
                        Back
                    </ErrorButton>
                    <PrimaryButton
                        sx={{ width: '45%' }}
                        onClick={() => nextHandler()}
                    >
                        Next
                    </PrimaryButton>
                </Box>
            </DialogContent>
        </BootstrapDialog>
    )
}
