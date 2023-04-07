import React, { useEffect, useState } from 'react'
import { Box, Grid, Typography, Tabs, Tab } from '@mui/material'
import OutlinedInput from '@mui/material/OutlinedInput'
import { makeStyles } from '@mui/styles'
import { Theme, useTheme } from '@mui/material/styles'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import SecondaryButton from '../../../components/secondary-button'
import StatsTable from './statsTable'
import Tooltip from '@mui/material/Tooltip'
import { SOCIAL_MEDIA_PLATFORMS } from '../../../config'

const useStyles = makeStyles((theme: Theme) => ({
    input: {
        color: theme.palette.secondary.dark,
        marginTop: '10px',
        minWidth: '350px',
        '& fieldset': {
            height: '58px',
        },
    },
}))

const TypeOfMedia = [
    { label: 'Music Licenses' },
    { label: 'Patent Licenses' },
    { label: 'Video Licenses' },
]

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

interface StatsPageProps {
    soldLicenses: any[]
    handler: (license: any) => void
}

interface SoldLicenseType {
    licenseName: string
    averagePrice: number
    copiedSold: number
    totalSales: number
    popularPlatform: string
}

export default function StatsPage({ soldLicenses, handler }: StatsPageProps) {
    const theme = useTheme()
    const classes = useStyles()
    const [keyword, setKeyword] = useState<string>()
    const [mediaType, setMediaType] = useState<string>(TypeOfMedia[0].label)
    const [platformType, setPlatformType] = useState<string>(
        SOCIAL_MEDIA_PLATFORMS[0].label,
    )
    const [calculated, setCalculated] = useState<Array<SoldLicenseType>>()
    const [allSoldLicenses, setAllSoldLicenses] =
        useState<Array<SoldLicenseType>>()

    const mediaHandler = (event: SelectChangeEvent<typeof mediaType>) => {
        const {
            target: { value },
        } = event
        setMediaType(value)
    }

    const platformHandler = (event: SelectChangeEvent<typeof platformType>) => {
        const {
            target: { value },
        } = event
        setPlatformType(value)
    }

    useEffect(() => {
        function findOcc(arr, key) {
            const arr2 = []

            arr.forEach((x) => {
                // Checking if there is any object in arr2
                // which contains the key value
                if (
                    arr2.some((val) => {
                        return val[key] == x[key]
                    })
                ) {
                } else {
                    // If not! Then create a new object initialize
                    // it with the present iteration key's value and
                    // set the occurrence to 1
                    const a = {}
                    a[key] = x[key]
                    arr2.push(a)
                }
            })

            return arr2
        }
        const calculatedSold = soldLicenses?.map((group) => {
            const records = group.records
            let averagePrice = 0
            let totalSales = 0
            const copiedSold = records.length
            records.map((record) => {
                totalSales += Number(record.price)
            })
            averagePrice = totalSales / copiedSold
            const result = findOcc(records, 'usecase')
            const popularPlatform = result[0]?.usecase || ''
            const license = {
                licenseName: group._id,
                averagePrice,
                copiedSold,
                totalSales,
                popularPlatform,
            }
            return license
        })
        setCalculated(calculatedSold)
        setAllSoldLicenses(calculatedSold)
    }, [soldLicenses])

    const searchByLicenseName = async (
        event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    ) => {
        setKeyword(event.target.value)
        if (!event.target.value || event.target.value === '') {
            setCalculated(allSoldLicenses)
        } else {
            const filterd = allSoldLicenses.filter((license) => {
                if (
                    license.licenseName.toLowerCase() ===
                        event.target.value.toLowerCase() ||
                    license.licenseName
                        .toLowerCase()
                        .includes(event.target.value.toLowerCase())
                ) {
                    return true
                } else {
                    return false
                }
            })
            setCalculated(filterd)
        }
    }

    return (
        <>
            <Box
                display="flex"
                justifyContent="space-between"
                marginTop={'20px'}
            >
                <OutlinedInput
                    placeholder="Search"
                    className={classes.input}
                    value={keyword}
                    onChange={(e) => searchByLicenseName(e)}
                    type="text"
                    required
                />
                <Select
                    value={mediaType}
                    onChange={mediaHandler}
                    input={<OutlinedInput sx={{ width: '100%' }} />}
                    renderValue={(selected) => {
                        return selected
                    }}
                    MenuProps={MenuProps}
                    inputProps={{ 'aria-label': 'Without label' }}
                    sx={{
                        height: '50px',
                        width: '100%',
                        maxWidth: '350px',
                        backgroundColor: theme.palette.background.default,
                    }}
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
                    input={<OutlinedInput sx={{ width: '100%' }} />}
                    renderValue={(selected) => {
                        return selected
                    }}
                    MenuProps={MenuProps}
                    inputProps={{ 'aria-label': 'Without label' }}
                    sx={{
                        height: '50px',
                        width: '100%',
                        maxWidth: '350px',
                        backgroundColor: theme.palette.background.default,
                    }}
                >
                    {SOCIAL_MEDIA_PLATFORMS.map((media, idx) => (
                        <MenuItem key={idx} value={media.label}>
                            {media.label}
                        </MenuItem>
                    ))}
                </Select>
            </Box>
            <StatsTable soldLicenses={calculated} />
        </>
    )
}
