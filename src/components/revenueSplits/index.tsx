import React, { useState, useEffect } from 'react'
import { Box, OutlinedInput, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Divider from '@mui/material/Divider'
import { useTheme } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Button from '@mui/material/Button'
import IOSSwitch from '../isoSwitch'
import { RECORDLABEL_OPTIONS } from '../../config'

const BoxContainer = styled(Box)(({ theme }) => ({
    width: '50%',
    border: `2px solid ${theme.palette.secondary.main}`,
    marginTop: 30,
    marginBottom: 30,
    alignItems: 'center',
}))

export interface RecordLabelRevenueType {
    artistName: string
    artistId: string
    artistAddress: string
    percentage: number
    isAdmin: boolean
}

export interface ArtistRevenueType {
    artistName: string
    artistId: string
    artistAddress: string
    percentage: number
    isAdmin: boolean
}

export type RevenueSplitsProps = {
    readOnly?: boolean
    trackName: string
    artistRevenues: Array<any>
    recordRevenues: Array<any>
    setArtistRevenues: (revenues: ArtistRevenueType[]) => void
    setRecordRevenues: (revenues: RecordLabelRevenueType[]) => void
}

const useStyles = makeStyles({
    root: {
        cursor: 'pointer',
        textAlign: 'center',
        display: 'flex',
        '&:hover p,&:hover svg,& img': {
            opacity: 1,
        },
        '& p, svg': {
            opacity: 0.4,
        },
        '&:hover img': {
            opacity: 0.3,
        },
    },
    noMouseEvent: {
        pointerEvents: 'none',
    },
    iconText: {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
    },
    hidden: {
        display: 'none',
    },
    onDragOver: {
        '& img': {
            opacity: 0.3,
        },
        '& p, svg': {
            opacity: 1,
        },
    },
    container: {
        alignItems: 'center',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
    },
    flexRowContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
})

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

export const RevenueSplits: React.FC<RevenueSplitsProps> = ({
    readOnly,
    trackName,
    artistRevenues,
    recordRevenues,
    setArtistRevenues,
    setRecordRevenues,
}) => {
    const theme = useTheme()
    const classes = useStyles()

    const handleRecordLabelSelect = (
        event: SelectChangeEvent,
        index: number,
    ) => {
        const records = [...recordRevenues]
        records[index].name = event.target.value
        setRecordRevenues(records)
    }

    const artistRevenueHandler = (
        event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
        index: number,
    ) => {
        const tmp = [...artistRevenues]
        tmp[index].percentage = Number(event.target.value)
        setArtistRevenues(tmp)
    }

    const recordRevenueHandler = (
        event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
        index: number,
    ) => {
        const records = [...recordRevenues]
        records[index].percentage = Number(event.target.value)
        setRecordRevenues(records)
    }

    const recordLabelSwitchHandler = (index: number) => {
        const records = [...recordRevenues]
        records[index].isAdmin = !records[index].isAdmin
        setRecordRevenues(records)
    }

    const artistSwitchHandler = (index: number) => {
        const tmp = [...artistRevenues]
        tmp[index].isAdmin = !tmp[index].isAdmin
        setArtistRevenues(tmp)
    }

    const addHandler = () => {
        setRecordRevenues([
            ...recordRevenues,
            {
                artistId: RECORDLABEL_OPTIONS[0],
                artistAddress: '0x0000000000000000000000000000000000000000',
                artistName: RECORDLABEL_OPTIONS[0],
                percentage: 0,
                isAdmin: false,
            },
        ])
    }

    return (
        <Box className={classes.container}>
            <Typography variant="h6" gutterBottom>
                Set Revenue Splits And Permissions
            </Typography>
            <BoxContainer>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Typography
                        variant="h6"
                        gutterBottom
                        sx={{
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            maxWidth: '300px',
                        }}
                    >
                        {trackName}
                    </Typography>
                </Box>
                <Typography variant="h6" gutterBottom>
                    Artists:
                </Typography>
                {artistRevenues?.map((artist, idx) => {
                    return (
                        <Box key={idx}>
                            <Typography
                                variant="subtitle1"
                                style={{ marginTop: 20 }}
                                gutterBottom
                            >
                                {artist?.artistName}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                Set Revenue Percentage
                            </Typography>
                            <Box className={classes.flexRowContainer}>
                                <Box
                                    component="form"
                                    sx={{
                                        '& > :not(style)': {
                                            m: 1,
                                            width: '25ch',
                                        },
                                    }}
                                    noValidate
                                    autoComplete="off"
                                >
                                    <TextField
                                        value={artist.percentage}
                                        placeholder="percentage"
                                        // id={artist.name}
                                        // label={artist.name}
                                        variant="outlined"
                                        type="number"
                                        inputProps={{ readOnly: readOnly }}
                                        onChange={(e) =>
                                            artistRevenueHandler(e, idx)
                                        }
                                    />
                                </Box>
                                <IOSSwitch
                                    disabled={readOnly}
                                    sx={{ ml: 1 }}
                                    checked={artist.isAdmin}
                                    onClick={() => artistSwitchHandler(idx)}
                                />
                            </Box>
                        </Box>
                    )
                })}
                <Divider color={theme.palette.secondary.light} />
                <Box style={{ marginTop: 30, marginBottom: 30 }}>
                    {recordRevenues?.map((recordLabel, iIdx) => {
                        return (
                            <Box key={iIdx}>
                                <Typography variant="body2" gutterBottom>
                                    Select Record Label
                                </Typography>
                                <Select
                                    value={recordLabel.artistName}
                                    onChange={(e) =>
                                        handleRecordLabelSelect(e, iIdx)
                                    }
                                    input={
                                        <OutlinedInput sx={{ width: '100%' }} />
                                    }
                                    renderValue={(selected) => {
                                        return selected
                                    }}
                                    MenuProps={MenuProps}
                                    inputProps={{
                                        'aria-label': 'Without label',
                                    }}
                                    sx={{
                                        width: '100%',
                                        maxWidth: '300px',
                                        backgroundColor:
                                            theme.palette.background.default,
                                    }}
                                    disabled={readOnly}
                                >
                                    {RECORDLABEL_OPTIONS.map(
                                        (_recordLabel, idx) => {
                                            return (
                                                <MenuItem
                                                    value={_recordLabel}
                                                    key={idx}
                                                >
                                                    {_recordLabel}
                                                </MenuItem>
                                            )
                                        },
                                    )}
                                </Select>
                                <Typography variant="body2" gutterBottom>
                                    Set Revenue Percentage
                                </Typography>
                                <Box className={classes.flexRowContainer}>
                                    <Box
                                        component="form"
                                        sx={{
                                            '& > :not(style)': {
                                                m: 1,
                                                width: '25ch',
                                            },
                                        }}
                                        noValidate
                                        autoComplete="off"
                                    >
                                        <TextField
                                            value={recordLabel.percentage}
                                            placeholder="percentage"
                                            // id={item.name}
                                            // label={item.name}
                                            variant="outlined"
                                            type="number"
                                            inputProps={{ readOnly: readOnly }}
                                            onChange={(e) =>
                                                recordRevenueHandler(e, iIdx)
                                            }
                                        />
                                    </Box>
                                    <IOSSwitch
                                        disabled={readOnly}
                                        sx={{ ml: 1 }}
                                        checked={recordLabel.isAdmin}
                                        onClick={() =>
                                            recordLabelSwitchHandler(iIdx)
                                        }
                                    />
                                </Box>
                            </Box>
                        )
                    })}
                    <Button
                        disabled={readOnly}
                        variant="contained"
                        sx={{ textTransform: 'capitalize' }}
                        onClick={() => addHandler()}
                    >
                        Add a record label
                    </Button>
                </Box>
            </BoxContainer>
        </Box>
    )
}
