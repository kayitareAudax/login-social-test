import React, { useEffect, useRef, useState } from 'react'
import Carousel from 'react-multi-carousel'
import { styled } from '@mui/material/styles'
import CustomSlider from '../custom-slider'
import { makeStyles } from '@mui/styles'

interface CarouselProps {
    settings: any
    children: any
    isSliderExisted?: boolean
    size?: any
}

const SlideContainer = styled('div')(({ theme }) => ({
    [theme.breakpoints.down('md')]: {
        padding: '20px',
    },
    [theme.breakpoints.down('sm')]: {
        padding: '10px',
    },
}))

const CustomCarousel: React.FC<CarouselProps> = ({
    settings,
    children,
    isSliderExisted,
    size,
}) => {
    const currentCarousel = useRef(null)
    const [pending, setPending] = useState(false)

    useEffect(() => {
        if (size > 0) {
            setPending(true)
        }
    }, [size])

    useEffect(() => {
        if (pending) {
            setPending(false)
        }
    }, [pending])

    const [additionalTransform, setAdditionalTransform] = useState(0)
    return (
        <SlideContainer>
            {!pending ? (
                <Carousel
                    ref={currentCarousel}
                    infinite={false}
                    dotListClass="custom-dot-list-style"
                    responsive={settings}
                    ssr={true}
                    customButtonGroup={
                        currentCarousel && isSliderExisted ? (
                            <CustomSlider
                                carouselState={true}
                                currentCarousel={currentCarousel}
                                additionalTransform={additionalTransform}
                                setAdditionalTransform={setAdditionalTransform}
                            />
                        ) : (
                            <></>
                        )
                    }
                >
                    {children}
                </Carousel>
            ) : null}
        </SlideContainer>
    )
}

export default CustomCarousel
