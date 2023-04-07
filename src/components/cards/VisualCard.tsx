import React from 'react'
import { styled } from '@mui/material/styles'
import { Box, Typography } from '@mui/material'
import SecondaryButton from '../secondary-button'

const CardFooter = styled(Box)(({ theme }) => ({
    display: 'flex',
    position: 'absolute',
    bottom: 0,
    width: '90%',
    padding: '20px',
    justifyContent: 'space-between',
    [theme.breakpoints.down('md')]: {
        flexDirection: 'column',
    },
}))

const ItemContainer = styled(Box)(({ theme }) => ({
    position: 'relative',
    margin: theme.spacing(2),
    border: `1px solid ${theme.content.container.dark}`,
    borderRadius: theme.spacing(0.5),
    display: 'flex',
    flexDirection: 'column',
}))

const ImageContainer = styled('img')(({ theme }) => ({
    width: '100%',
    borderRadius: theme.spacing(0.5),
    // minHeight: theme.spacing(40),
}))

const StyledTitle = styled(Typography)(({ theme }) => ({
    fontSize: theme.spacing(2),
    fontWeight: 'bold',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    maxWidth: '150px',
}))

interface VisualCardProps {
    imageSrc: string
    songName: string
    artist: string
    viewLicense: () => void
}

const VisualCard: React.FC<VisualCardProps> = (props) => {
    const { imageSrc, songName, artist, viewLicense } = props
    return (
        <ItemContainer>
            <ImageContainer src={imageSrc} />
            <CardFooter>
                <Box>
                    <StyledTitle>{songName}</StyledTitle>
                    <StyledTitle>{artist}</StyledTitle>
                </Box>
                <SecondaryButton onClick={viewLicense}>
                    View License
                </SecondaryButton>
            </CardFooter>
        </ItemContainer>
    )
}

export default VisualCard
