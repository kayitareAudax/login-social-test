import type { Identifier, XYCoord } from 'dnd-core'
import type { FC } from 'react'
import { useRef, useCallback, useMemo } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { Grid, Box } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Theme, useTheme } from '@mui/material/styles'
import { TabItem } from '../editablePublic'
import { IPCard, IPCardBoxType } from '../../../components/cards'
import AddItem from '../addItem'
import SettingMenu from '../settingMenu'
import { SectionImage } from '../sectionImage'
import PreviewMusic from '../previewMusic'
import DescriptionTextField from '../description'
import { SectionVideo } from '../sectionVideo'
import { API_URL } from '../../../config'
import CustomCarousel from '../../../components/custom-carousel'
import { SizeTypes, SectionTypes } from '../../../config'

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: 'flex',
        padding: '10px 0px',
        flexDirection: 'column',
    },
    spotifyButton: {
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.primary.contrastText,
        width: '40%',
        height: '50px',
        padding: '6px 8px',
        outline: 0,
        border: 0,
        marginLeft: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textTransform: 'capitalize',
        borderRadius: '4px',
        position: 'relative',
        boxSizing: 'border-box',
        cursor: 'pointer',
        transition:
            'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        '&:hover': {
            backgroundColor: theme.palette.primary.main,
            textDecoration: 'none',
        },
        '&.Mui-disabled': {
            backgroundColor: theme.palette.primary.dark,
        },
    },
}))

export const ItemTypes = {
    CARD: 'card',
}

export interface SectionCardProps {
    id: any
    tabIdx: number
    text: string
    type: SectionTypes
    index: number
    sections: any
    tabPages: TabItem[]
    setTabPages: (tabPages: TabItem[]) => void
    moveSection: (dragIndex: number, hoverIndex: number) => void
    addItemHandler: (sectionId: number, type: SectionTypes) => void
}

interface DragItem {
    index: number
    id: string
    type: string
}

export const SectionCard: FC<SectionCardProps> = ({
    id,
    tabIdx,
    text,
    type,
    index,
    sections,
    tabPages,
    setTabPages,
    moveSection,
    addItemHandler,
}) => {
    const classes = useStyles()
    const ref = useRef<HTMLDivElement>(null)

    const [{ handlerId }, drop] = useDrop<
        DragItem,
        void,
        { handlerId: Identifier | null }
    >({
        accept: ItemTypes.CARD,
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            }
        },
        hover(item: DragItem, monitor) {
            if (!ref.current) {
                return
            }
            const dragIndex = item.index
            const hoverIndex = index

            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return
            }

            // Determine rectangle on screen
            const hoverBoundingRect = ref.current?.getBoundingClientRect()

            // Get vertical middle
            const hoverMiddleY =
                (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

            // Determine mouse position
            const clientOffset = monitor.getClientOffset()

            // Get pixels to the top
            const hoverClientY =
                (clientOffset as XYCoord).y - hoverBoundingRect.top

            // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%

            // Dragging downwards
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return
            }

            // Dragging upwards
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return
            }

            // Time to actually perform the action
            moveSection(dragIndex, hoverIndex)

            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            item.index = hoverIndex
        },
    })

    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.CARD,
        item: () => {
            return { id, index }
        },
        collect: (monitor: any) => ({
            isDragging: monitor.isDragging(),
        }),
    })

    drag(drop(ref))

    const descriptionHandler = useCallback(
        (
            event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
            idxOfDescription: number,
        ) => {
            const tmpTabPages = tabPages.map((item) => {
                if (item.id === tabIdx) {
                    item.tabPage.map((ele) => {
                        if (ele.id === id) {
                            ele.data[idxOfDescription].text = event.target.value
                        }
                    })
                }
                return item
            })
            setTabPages(tmpTabPages)
        },
        [id, setTabPages, tabIdx, tabPages],
    )

    const removeDescriptionHandler = useCallback(
        (idx) => {
            const tmpTabPages = tabPages.map((item) => {
                if (item.id === tabIdx) {
                    const tmpPage = item.tabPage.map((ele) => {
                        if (ele.id === id) {
                            ele.data.splice(idx, 1)
                            return {
                                ...ele,
                                data: ele.data,
                            }
                        } else {
                            return ele
                        }
                    })
                    return {
                        ...item,
                        tabPage: tmpPage,
                    }
                } else {
                    return item
                }
            })
            setTabPages(tmpTabPages)
        },
        [id, setTabPages, tabIdx, tabPages],
    )

    const getResponsiveSize = (size) => {
        let itemCount = 4
        switch (size) {
            case SizeTypes.Small:
                itemCount = 6
                break
            case SizeTypes.Medium:
                itemCount = 4
                break
            case SizeTypes.Large:
                itemCount = 2
                break
            default:
                itemCount = 4
        }

        return {
            superLargeDesktop: {
                // the naming can be any, depends on you.
                breakpoint: { max: 4000, min: 3000 },
                items: itemCount,
            },
            desktop: {
                breakpoint: { max: 3000, min: 1024 },
                items: itemCount,
            },
            tablet: {
                breakpoint: { max: 1024, min: 464 },
                items: 2,
            },
            mobile: {
                breakpoint: { max: 464, min: 0 },
                items: 1,
            },
        }
    }

    const addLicenseHandler = useCallback(
        (idx) => {
            const tmpTabPages = tabPages.map((item) => {
                if (item.id === tabIdx) {
                    item.tabPage.map((ele) => {
                        if (ele.id === id) {
                            ele.data.contents.splice(idx, idx + 1)
                        }
                    })
                }
                return { ...item }
            })
            setTabPages(tmpTabPages)
        },
        [id, setTabPages, tabIdx, tabPages],
    )

    const addImageHandler = useCallback(
        (idx) => {
            const tmpTabPages = tabPages.map((item) => {
                if (item.id === tabIdx) {
                    const tmpPage = item.tabPage.map((ele) => {
                        if (ele.id === id) {
                            ele.data.splice(idx, 1)
                            return {
                                ...ele,
                                data: ele.data,
                            }
                        } else {
                            return ele
                        }
                    })
                    return {
                        ...item,
                        tabPage: tmpPage,
                    }
                } else {
                    return item
                }
            })
            setTabPages(tmpTabPages)
        },
        [id, setTabPages, tabIdx, tabPages],
    )

    const addPreviewHandler = useCallback(
        (idx) => {
            const tmpTabPages = tabPages.map((item) => {
                if (item.id === tabIdx) {
                    const tmpPage = item.tabPage.map((ele) => {
                        if (ele.id === id) {
                            ele.data.contents.splice(idx, 1)
                            return {
                                ...ele,
                                data: ele.data,
                            }
                        } else {
                            return ele
                        }
                    })
                    return {
                        ...item,
                        tabPage: tmpPage,
                    }
                } else {
                    return item
                }
            })
            setTabPages(tmpTabPages)
        },
        [id, setTabPages, tabIdx, tabPages],
    )
    const cardArr = useMemo(() => {
        let result = null
        let size = 4

        switch (type) {
            case SectionTypes.AddLicenseShowcaseSection:
                result = (
                    <CustomCarousel
                        settings={getResponsiveSize(sections?.size)}
                        isSliderExisted={false}
                        size={sections?.contents?.length + sections?.size}
                    >
                        {sections &&
                            sections?.contents.map((license, idx) => {
                                return (
                                    <IPCard
                                        key={idx}
                                        title={license.licenseName}
                                        imageSrc={license.imagePath}
                                        type={IPCardBoxType.CloseButton}
                                        checked={false}
                                        handleChange={() =>
                                            addLicenseHandler(idx)
                                        }
                                    />
                                )
                            })}
                        <AddItem
                            sectionId={id}
                            handleClick={addItemHandler}
                            sectionType={SectionTypes.AddLicenseShowcaseSection}
                        />
                    </CustomCarousel>
                )
                break
            case SectionTypes.AddImageSection:
                result = (
                    <Box
                        sx={{
                            display: 'flex',
                            flexWrap: 'nowrap',
                            overflow: 'auto',
                            minWidth: '100%',
                        }}
                    >
                        {sections &&
                            sections?.map((image, idx) => {
                                let imageWidth = 100
                                switch (image?.size) {
                                    case SizeTypes.Small:
                                        imageWidth = imageWidth / 4
                                        break
                                    case SizeTypes.Medium:
                                        imageWidth = imageWidth / 2
                                        break
                                    case SizeTypes.Large:
                                        imageWidth = imageWidth
                                        break
                                    default:
                                        imageWidth = imageWidth / 4
                                }
                                return (
                                    <Box
                                        key={idx}
                                        sx={{
                                            width: `${imageWidth}%`,
                                            minWidth: `${imageWidth}%`,
                                            marginRight: '10px',
                                        }}
                                    >
                                        <SectionImage
                                            showCloseButton={true}
                                            imageSrc={
                                                image.imageFile
                                                    ? image.imagePath
                                                    : `${API_URL}${image.imagePath}`
                                            }
                                            handleChange={() =>
                                                addImageHandler(idx)
                                            }
                                        />
                                    </Box>
                                )
                            })}
                        <Box sx={{ width: '33.33%', minWidth: '33.33%' }}>
                            <AddItem
                                sectionId={id}
                                handleClick={addItemHandler}
                                sectionType={SectionTypes.AddImageSection}
                            />
                        </Box>
                    </Box>
                )
                break
            case SectionTypes.AddMusicPreviewSection:
                result = (
                    <CustomCarousel
                        settings={getResponsiveSize(sections?.size)}
                        isSliderExisted={false}
                        size={sections?.contents?.length + sections?.size}
                    >
                        {sections &&
                            sections?.contents.map((license, idx) => {
                                return (
                                    <PreviewMusic
                                        key={idx}
                                        showCloseButton={true}
                                        imageSrc={license.imagePath}
                                        preview_url={license.preview_url}
                                        licenseName={license.licenseName}
                                        handleChange={() =>
                                            addPreviewHandler(idx)
                                        }
                                    />
                                )
                            })}
                        <AddItem
                            sectionId={id}
                            handleClick={addItemHandler}
                            sectionType={SectionTypes.AddMusicPreviewSection}
                        />
                    </CustomCarousel>
                )
                break
            case SectionTypes.AddDescriptionSection:
                result = (
                    <Box
                        sx={{
                            display: 'flex',
                            flexWrap: 'nowrap',
                            overflow: 'auto',
                            minWidth: '100%',
                        }}
                    >
                        {sections &&
                            sections?.map((description, idx) => {
                                let descriptionWidth = 100
                                switch (description?.size) {
                                    case SizeTypes.Small:
                                        descriptionWidth = descriptionWidth / 4
                                        break
                                    case SizeTypes.Medium:
                                        descriptionWidth = descriptionWidth / 2
                                        break
                                    case SizeTypes.Large:
                                        descriptionWidth = descriptionWidth
                                        break
                                    default:
                                        descriptionWidth = descriptionWidth / 4
                                }
                                return (
                                    <Box
                                        key={idx}
                                        sx={{
                                            width: `${descriptionWidth}%`,
                                            minWidth: `${descriptionWidth}%`,
                                            marginRight: '10px',
                                        }}
                                    >
                                        <DescriptionTextField
                                            showCloseButton={true}
                                            editMode={false}
                                            txt={description?.text}
                                            size={description?.size}
                                            handleChange={(e) =>
                                                descriptionHandler(e, idx)
                                            }
                                            removeItem={() =>
                                                removeDescriptionHandler(idx)
                                            }
                                        />
                                    </Box>
                                )
                            })}
                        <Box sx={{ width: '33.33%', minWidth: '33.33%' }}>
                            <AddItem
                                sectionId={id}
                                handleClick={addItemHandler}
                                sectionType={SectionTypes.AddDescriptionSection}
                            />
                        </Box>
                    </Box>
                )
                break
            case SectionTypes.AddVideoSection:
                size = 12
                result = (
                    <Grid container spacing={2}>
                        {sections &&
                            sections?.map((video, idx) => {
                                return (
                                    <Grid item xs={size} key={idx}>
                                        <SectionVideo
                                            showCloseButton={true}
                                            videoSrc={video?.videoUrl}
                                            handleChange={() => {
                                                const tmpTabPages =
                                                    tabPages.map((item) => {
                                                        if (
                                                            item.id === tabIdx
                                                        ) {
                                                            const tmpPage =
                                                                item.tabPage.map(
                                                                    (ele) => {
                                                                        if (
                                                                            ele.id ===
                                                                            id
                                                                        ) {
                                                                            ele.data.splice(
                                                                                idx,
                                                                                1,
                                                                            )
                                                                            return {
                                                                                ...ele,
                                                                                data: ele.data,
                                                                            }
                                                                        } else {
                                                                            return ele
                                                                        }
                                                                    },
                                                                )
                                                            return {
                                                                ...item,
                                                                tabPage:
                                                                    tmpPage,
                                                            }
                                                        } else {
                                                            return item
                                                        }
                                                    })
                                                setTabPages(tmpTabPages)
                                            }}
                                        />
                                    </Grid>
                                )
                            })}
                        <Grid item xs={size}>
                            <AddItem
                                sectionId={id}
                                handleClick={addItemHandler}
                                sectionType={SectionTypes.AddVideoSection}
                            />
                        </Grid>
                    </Grid>
                )
                break
            default:
                break
        }
        return result
    }, [
        type,
        addItemHandler,
        id,
        sections,
        setTabPages,
        tabIdx,
        tabPages,
        removeDescriptionHandler,
        descriptionHandler,
        addLicenseHandler,
        addImageHandler,
        addPreviewHandler,
    ])

    const sectionNameHandler = useCallback(
        (newSectionName: string) => {
            const tmp = tabPages.map((item) => {
                if (item.id === tabIdx) {
                    const tmpTabPage = item.tabPage.map((ele) => {
                        if (ele.id === id) {
                            return { ...ele, sectionName: newSectionName }
                        } else {
                            return ele
                        }
                    })
                    return { ...item, tabPage: tmpTabPage }
                } else {
                    return item
                }
            })
            setTabPages(tmp)
        },
        [setTabPages, id, tabIdx, tabPages],
    )

    const settingHandler = useCallback(
        (sizeType: SizeTypes) => {
            const tmpTabPages = tabPages.map((item) => {
                if (item.id === tabIdx) {
                    item.tabPage.map((ele) => {
                        if (ele.id === id) {
                            ele.data.size = sizeType
                        }
                    })
                }
                return item
            })
            setTabPages(tmpTabPages)
        },
        [setTabPages, id, tabIdx, tabPages],
    )

    const settingMenu = useMemo(() => {
        let result = null
        switch (type) {
            case SectionTypes.AddLicenseShowcaseSection:
            case SectionTypes.AddMusicPreviewSection:
                result = (
                    <SettingMenu
                        settingHandler={settingHandler}
                        isSettingExisted={true}
                        initialSectionName={text}
                        sectionNameHandler={sectionNameHandler}
                    />
                )
                break
            case SectionTypes.AddImageSection:
            case SectionTypes.AddDescriptionSection:
            case SectionTypes.AddVideoSection:
                result = (
                    <SettingMenu
                        isSettingExisted={false}
                        initialSectionName={text}
                        sectionNameHandler={sectionNameHandler}
                    />
                )
                break
            default:
                break
        }
        return result
    }, [type, sectionNameHandler, text, settingHandler])

    return (
        <Box className={classes.root}>
            <Box display={'flex'} alignItems="center">
                <Box
                    ref={ref}
                    data-handler-id={handlerId}
                    sx={{ cursor: 'move', width: '100%' }}
                >
                    {settingMenu}
                </Box>
            </Box>
            <Box>{cardArr}</Box>
        </Box>
    )
}
