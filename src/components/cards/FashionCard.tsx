import React from 'react'
import { styled } from '@mui/material/styles'
import { Box, Tabs, Tab, Grid, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { toast } from 'react-hot-toast'
import { getPublicProfile } from '../../api'
interface FashionCardProps {
    id?: string
    imageSrc: string
    artistName: string
}

const IPCardContainer = styled(Box)(({ theme }) => ({
    background: theme.palette.secondary.main,
    margin: '20px',
    borderRadius: theme.spacing(0.5),
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
    height: 'calc(100% - 40px)',
}))

const StyledImage = styled('img')(({ theme }) => ({
    objectFit: 'cover',
    width: '50%',
    margin: 'auto',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    borderRadius: '50%',
}))

const StyledTitle = styled(Typography)(({ theme }) => ({
    color: theme.palette.primary.contrastText,
    padding: theme.spacing(0.2),
    fontSize: theme.spacing(2),
    textAlign: 'center',
    [theme.breakpoints.down('md')]: {
        fontSize: theme.spacing(1.5),
    },
}))

const FashionCard: React.FC<FashionCardProps> = (props) => {
    const navigate = useNavigate()
    const goToProfilePage = async () => {
        try {
            const res = await getPublicProfile(props?.id, 'Spotify')
            if (res.status === 200 && res.data.success) {
                navigate(`/view-profile/Spotify/${props?.id}/0`)
            } else {
                toast.error('This artist does not have public profile')
            }
        } catch (e) {
            console.log('error in getting public profile')
            toast.error('Something went wrong')
        }
    }

    if (props.imageSrc)
        return (
            <IPCardContainer onClick={() => goToProfilePage()}>
                <StyledImage src={props.imageSrc} alt="artist"></StyledImage>
                <Box>
                    <StyledTitle>{props.artistName}</StyledTitle>
                </Box>
            </IPCardContainer>
        )
    else
        return (
            <IPCardContainer onClick={() => goToProfilePage()}>
                <AccountCircleIcon />
                <Box>
                    <StyledTitle>{props.artistName}</StyledTitle>
                </Box>
            </IPCardContainer>
        )
}

export default FashionCard
