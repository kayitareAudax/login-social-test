import React from 'react'
import { styled } from '@mui/material/styles'
import { makeStyles } from '@mui/styles'

const CustomSliderContainer = styled('div')((theme) => ({
    position: 'absolute',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    height: '4px',
    background: '#fff',
    bottom: '6px',
}))

const useStyles = makeStyles({
    custom_slider__input: {
        width: '100%',
        height: '2px',
    },
})

interface CustomSliderProps {
    carouselState: any
    currentCarousel: any
    additionalTransform: number
    setAdditionalTransform: any
}

const CustomSlider: React.FC<CustomSliderProps> = ({
    carouselState,
    currentCarousel,
    additionalTransform,
    setAdditionalTransform,
}) => {
    const classes = useStyles()
    let value = 0
    let carouselItemWidth = 0
    if (currentCarousel.current) {
        carouselItemWidth = currentCarousel.current.state.itemWidth
        const maxTranslateX = Math.round(
            // so that we don't over-slide
            carouselItemWidth *
                (currentCarousel.current.state.totalItems -
                    currentCarousel.current.state.slidesToShow) +
                150,
        )
        value = maxTranslateX / 100 // calculate the unit of transform for the slider
    }
    const { transform } = carouselState
    return (
        <React.Fragment>
            {carouselState && (
                <CustomSliderContainer>
                    <input
                        type="range"
                        value={'' + Math.round(Math.abs(transform) / value)}
                        max={
                            (carouselItemWidth *
                                (carouselState.totalItems -
                                    carouselState.slidesToShow) +
                                (additionalTransform === 150 ? 0 : 150)) /
                            value
                        }
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            if (currentCarousel.current.isAnimationAllowed) {
                                currentCarousel.current.isAnimationAllowed =
                                    false
                            }
                            const nextTransform = Number(e.target.value) * value
                            const nextSlide = Math.round(
                                nextTransform / carouselItemWidth,
                            )
                            if (
                                e.target.value === '0' &&
                                additionalTransform === 150
                            ) {
                                currentCarousel.current.isAnimationAllowed =
                                    true
                                setAdditionalTransform(0)
                            }
                            currentCarousel.current.setState({
                                transform: -nextTransform, // padding 20px and 5 items.
                                currentSlide: nextSlide,
                            })
                        }}
                        className={classes.custom_slider__input}
                    />
                </CustomSliderContainer>
            )}
        </React.Fragment>
    )
}

export default CustomSlider
