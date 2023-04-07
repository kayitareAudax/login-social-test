import update from 'immutability-helper'
import type { FC } from 'react'
import { useCallback, useState } from 'react'
import { Typography } from '@mui/material'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import { Theme, useTheme } from '@mui/material/styles'
import { AccountCard } from './accountCard'
import PrimaryButton from '../../../components/primary-button'
import { makeStyles } from '@mui/styles'

export enum AccountTypes {
    Instagram = 0,
    Twitter,
    Website,
    YouTube,
    Spotify,
    Twitch,
}

export interface Item {
    id: number
    text: string
    isLinked: boolean
    type: AccountTypes
    accountData: any
}

export interface ContainerState {
    cards: Item[]
}

interface SocialLinksContainerProps {
    socialLinks: any
    setSocialLinks: (any) => void
}

export function SocialLinksContainer({
    socialLinks,
    setSocialLinks,
}: SocialLinksContainerProps) {
    {
        const moveCard = useCallback(
            (dragIndex: number, hoverIndex: number) => {
                setSocialLinks((prevCards: Item[]) =>
                    update(prevCards, {
                        $splice: [
                            [dragIndex, 1],
                            [hoverIndex, 0, prevCards[dragIndex] as Item],
                        ],
                    }),
                )
            },
            [setSocialLinks],
        )

        const renderCard = useCallback(
            (
                card: {
                    id: number
                    text: string
                    isLinked: boolean
                    type: AccountTypes
                },
                index: number,
            ) => {
                return (
                    <AccountCard
                        key={card.id}
                        index={index}
                        id={card.id}
                        text={card.text}
                        isLinked={card.isLinked}
                        type={card.type}
                        cards={socialLinks}
                        moveCard={moveCard}
                        setCards={setSocialLinks}
                    />
                )
            },
            [moveCard, socialLinks, setSocialLinks],
        )

        return <>{socialLinks.map((card, i) => renderCard(card, i))}</>
    }
}

const useStyles = makeStyles((theme: Theme) => ({
    saveButton: {
        width: '100%',
        maxWidth: '300px',
        height: '50px',
        margin: '10px 0px 0px 0px',
    },
}))

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
    '& .MuiPaper-root': {
        backgroundColor: theme.content.container.dark,
    },
}))

export interface DialogTitleProps {
    id: string
    children?: React.ReactNode
    onClose: () => void
}

export interface SocialLinkingDialogProps {
    socialLinks: any
    open: boolean
    setSocialLinks: (any) => void
    setOpen: (open: boolean) => void
    handler: (socialLinks: Array<any>) => void
}

export default function SocialLinkingDialog({
    socialLinks,
    open,
    setSocialLinks,
    setOpen,
    handler,
}: SocialLinkingDialogProps) {
    const classes = useStyles()
    const handleClose = () => {
        setOpen(false)
    }

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
                    Link Social Platforms
                </Typography>
                <SocialLinksContainer
                    socialLinks={socialLinks}
                    setSocialLinks={setSocialLinks}
                />
                <Box display="flex" justifyContent="center" alignItems="center">
                    <PrimaryButton
                        className={classes.saveButton}
                        onClick={() => setOpen(false)}
                    >
                        Done
                    </PrimaryButton>
                </Box>
            </DialogContent>
        </BootstrapDialog>
    )
}
