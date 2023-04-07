import { Box, IconButton, Typography, useTheme } from '@mui/material'
import { styled } from '@mui/material/styles'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import { useRef, useState, useEffect, useCallback } from 'react'
import Slider from '@mui/material/Slider'
import { RoleTypes } from '../../reducers/authorizationReducer'
import { useSelector } from 'react-redux'
import { checkIfLiked, likeOrDislikeLicense } from '../../api/user'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'

const MAX_TIME = 30

const ImageContainer = styled('img')(({ theme }) => ({
    width: '100%',
    border: `1px solid ${theme.content.container.dark}`,
}))

interface MusicPlayerProps {
    imageSrc: string
    preview_url: string
    tagName: string
    listedId: number
}

const MusicPlayer = ({
    imageSrc,
    preview_url,
    tagName,
    listedId,
}: MusicPlayerProps) => {
    const theme = useTheme()
    const [isFavorite, setFavorite] = useState<boolean>(false)
    const [isPlaying, setIsPlaying] = useState<boolean>(false)
    const [pos, setPos] = useState<number>(0)
    const audioRef = useRef(new Audio(preview_url))
    const authorization = useSelector(
        (state: { authorization: any }) => state.authorization,
    )

    const isSeller =
        authorization?.currentUser?.role === RoleTypes.Seller ||
        authorization?.currentUser?.role === RoleTypes.Mixed

    const favoriteHandler = async () => {
        try {
            const res = await likeOrDislikeLicense(
                authorization?.currentUser?.walletAddress,
                listedId,
            )
            if (res.status === 200 && res.data.success) setFavorite(!isFavorite)
        } catch (e) {
            console.error('likeOrDislikeLicense Error', e)
        }
    }

    const playHandler = () => {
        if (audioRef) {
            if (MAX_TIME <= audioRef?.current.currentTime) {
                audioRef.current.currentTime = 0
            }
            if (isPlaying) {
                audioRef.current.pause()
            } else {
                audioRef.current.play()
            }
            setIsPlaying(!isPlaying)
        } else {
            setIsPlaying(false)
            console.log('could not catch audio ref', audioRef)
        }
    }

    const onScrub = (e) => {
        const currentValue = e.target.value
        console.log('currentValue', currentValue)
        const audioEle = document.getElementById('myAudio')
        if (audioEle) {
            audioRef.current.currentTime = currentValue
            audioRef.current.play()
            setIsPlaying(true)
        } else {
            setIsPlaying(false)
            console.log('slider error')
        }
    }

    const check = useCallback(async () => {
        const res = await checkIfLiked(
            authorization?.currentUser?.walletAddress,
            listedId,
        )
        if (res.status === 200 && res.data.success) {
            setFavorite(true)
        } else {
            setFavorite(false)
        }
    }, [authorization?.currentUser?.walletAddress, listedId])

    useEffect(() => {
        check()
    }, [check])

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (audioRef.current.currentTime >= MAX_TIME) {
                setPos(MAX_TIME)
            } else {
                setPos(audioRef.current.currentTime)
            }
        }, 1000)

        // clear interval on re-render to avoid memory leaks
        return () => clearInterval(intervalId)
    }, [])

    return (
        <Box sx={{ width: '400px' }}>
            <Box sx={{ position: 'relative', backgroundColor: 'white' }}>
                <ImageContainer src={imageSrc} />
                <audio id="myAudio" src={preview_url} />
                <Typography
                    sx={{
                        position: 'absolute',
                        padding: '2px 10px',
                        left: '-18px',
                        top: '-10px',
                        backgroundColor: theme.content.container.dark,
                        borderRadius: '4px',
                    }}
                >
                    {tagName}
                </Typography>
                {!isSeller && (
                    <IconButton
                        sx={{ position: 'absolute', right: '-60px', top: 0 }}
                        onClick={favoriteHandler}
                    >
                        {isFavorite ? (
                            <FavoriteIcon style={{ color: 'red' }} />
                        ) : (
                            <FavoriteBorderIcon />
                        )}
                    </IconButton>
                )}
                <IconButton
                    sx={{
                        position: 'absolute',
                        left: '-24px',
                        bottom: '-24px',
                        border: '1px solid',
                        background: 'white',
                    }}
                    onClick={playHandler}
                >
                    {isPlaying ? (
                        <PauseIcon style={{ fontSize: 48 }} />
                    ) : (
                        <PlayArrowIcon style={{ fontSize: 48 }} />
                    )}
                </IconButton>
            </Box>
            <Box>
                <Slider
                    size="small"
                    min={0}
                    max={30}
                    value={pos}
                    aria-label="Small"
                    valueLabelDisplay="auto"
                    sx={{ marginTop: '30px' }}
                    onChange={(e) => onScrub(e)}
                />
            </Box>
        </Box>
    )
}

export default MusicPlayer
