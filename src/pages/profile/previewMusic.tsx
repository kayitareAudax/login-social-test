import React, { useRef, useState, useEffect } from 'react'
import { Box, Typography, IconButton } from '@mui/material'
import Slider from '@mui/material/Slider'
import { Theme, useTheme } from '@mui/material/styles'
import { styled } from '@mui/material/styles'
import PlayCircleFilledOutlinedIcon from '@mui/icons-material/PlayCircleFilledOutlined'
import { makeStyles } from '@mui/styles'
import CloseIcon from '@mui/icons-material/Close'
import StyledIconButton from '../../components/styledIconButton'
import PauseIcon from '@mui/icons-material/Pause'
import PlayCircleIcon from '@mui/icons-material/PlayCircle'

const StyledImg = styled('img')(({ theme }) => ({
    borderRadius: '4px',
}))

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: 'flex',
        backgroundColor: theme.secondaryButton.background.light,
        padding: '20px',
        borderTopLeftRadius: '6px',
        borderTopRightRadius: '6px',
        position: 'relative',
    },
    checkBox: {
        position: 'absolute !important' as any,
        right: '-20px',
        top: '-20px',
    },
}))

interface PreviewMusicProps {
    licenseName: string
    imageSrc: string
    preview_url?: string
    showCloseButton: boolean
    handleChange: () => void
}

export default function PreviewMusic({
    licenseName,
    imageSrc,
    preview_url,
    showCloseButton,
    handleChange,
}: PreviewMusicProps) {
    const classes = useStyles()
    const MAX_TIME = 30
    const audioRef = useRef(new Audio(preview_url))
    const [isPlaying, setIsPlaying] = useState<boolean>(false)
    const [pos, setPos] = useState<number>(0)

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
        <Box sx={{ margin: '15px' }}>
            <Box className={classes.root}>
                <Box display="flex" alignItems="center">
                    <StyledImg
                        src={imageSrc}
                        sx={{
                            width: '32px',
                            objectFit: 'cover',
                        }}
                    />
                    <audio id="myAudio" src={preview_url} />
                    <Typography
                        sx={{
                            marginLeft: '20px',
                            whiteSpace: 'nowrap',
                            maxWidth: '200px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}
                        color="white"
                    >
                        {licenseName}
                    </Typography>
                </Box>
                <Box sx={{ marginLeft: 'auto' }}>
                    {/* <IconButton>
                        <PlayCircleFilledOutlinedIcon />
                    </IconButton> */}
                    <IconButton onClick={() => playHandler()}>
                        {!isPlaying ? <PlayCircleIcon /> : <PauseIcon />}
                    </IconButton>
                </Box>
                {showCloseButton && (
                    <StyledIconButton
                        variant="contained"
                        sx={{
                            position: 'absolute',
                            right: '-12px',
                            top: '-12px',
                            padding: 0,
                        }}
                        onClick={() => handleChange()}
                    >
                        <CloseIcon />
                    </StyledIconButton>
                )}
            </Box>
            <Slider
                size="small"
                min={0}
                max={30}
                value={pos}
                aria-label="Small"
                valueLabelDisplay="auto"
                onChange={(e) => onScrub(e)}
            />
        </Box>
    )
}
