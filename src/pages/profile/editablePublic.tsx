import React, { useEffect, useState, useCallback } from 'react'
import { Box, Grid, IconButton, OutlinedInput, Input } from '@mui/material'
import defaultSrc from '../../assets/image.svg'
import avatarArc from '../../assets/User-avatar.svg'
import { IPCard, IPCardBoxType } from '../../components/cards'
import SecondaryButton from '../../components/secondary-button'
import AddIcon from '@mui/icons-material/Add'
import TabNameDialog from './tabNameDialog'
import {
    ContainerFluid,
    Container,
    UploadImageContainer,
    UploadImage,
    PublicAvatarImageContainer,
    AvatarImage,
    PersonaLabel,
    TabsContainer,
    StyledTab,
    StyledTabs,
    useProfileStyles,
} from './style'
import PickDialog from './pickDialog'
import SocialLinkingDialog, { AccountTypes } from './socialLinkingDialog'
import AddLicensesDialog from './addLicensesDialog'
import AddImageDialog from './addImageDialog.tsx'
import AddDescriptionDialog from './addDescriptionDialog'
import AddVideoDialog from './addVideoDialog'
import { SectionCard } from './sectionCard'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
    getPublicProfile,
    publishPublicProfile,
    unPublishPublicProfile,
    savePublicProfile,
    uploadProfileImage,
} from '../../api/profile'
import { toast } from 'react-hot-toast'
import { useTheme } from '@mui/material'
import { API_URL, SectionTypes, SizeTypes } from '../../config'
import { Instagram } from '../../utils/utils'
import { useSearchParams } from 'react-router-dom'
import storage from '../../firebaseConfig'
import {
    ref,
    uploadBytesResumable,
    getDownloadURL,
    deleteObject,
} from 'firebase/storage'

export interface TabItem {
    id: number
    tabName: string
    tabPage: any
}

interface ImagePath {
    imagePath: string
    imageFile: File
}

const initialSocialLinks = [
    {
        id: 1,
        text: 'Instagram',
        isLinked: false,
        type: AccountTypes.Instagram,
        accountData: null,
    },
    {
        id: 2,
        text: 'Twitter',
        isLinked: false,
        type: AccountTypes.Twitter,
        accountData: null,
    },
    {
        id: 3,
        text: 'Website',
        isLinked: false,
        type: AccountTypes.Website,
        accountData: null,
    },
    {
        id: 4,
        text: 'YouTube',
        isLinked: false,
        type: AccountTypes.YouTube,
        accountData: null,
    },
    {
        id: 5,
        text: 'Spotify',
        isLinked: false,
        type: AccountTypes.Spotify,
        accountData: null,
    },
    {
        id: 6,
        text: 'Twitch',
        isLinked: false,
        type: AccountTypes.Twitch,
        accountData: null,
    },
]

const EditablePublicProfile = () => {
    const classes = useProfileStyles()
    const location = useLocation()
    const mediaName = location.state
    const navigate = useNavigate()
    const theme = useTheme()
    const [tabValue, setTabValue] = React.useState<string>('All License')
    const [openTabDlg, setOpenTabDlg] = useState<boolean>(false)
    const [openPickDlg, setOpenPickDlg] = useState<boolean>(false)
    const [openContactDlg, setOpenContactDlg] = useState<boolean>(false)
    const [keyword, setKeyword] = useState<string>('')
    const [currentTabIdx, setCurrentTabIdx] = useState<number>()

    // banner image
    const [bannerImage, setBannerImage] = useState<ImagePath>()

    // avatar image
    const [avatarImage, setAvatarImage] = useState<ImagePath>()

    // name
    const [editableName, setEditableName] = useState<boolean>(false)
    const [userName, setUserName] = useState<string>('')

    // contact info
    const [contactInfo, setContactInfo] = useState<any>()

    // social links
    const [socialLinks, setSocialLinks] =
        useState<Array<any>>(initialSocialLinks)

    // followers
    const [followers, setFollowers] = useState<Array<any>>()

    // ether scan link
    const [etherScanLink, setEtherScanLink] = useState<string>()

    const [tabPages, setTabPages] = useState<Array<any>>([
        { id: 0, tabName: 'All License', tabPage: [] },
    ])

    // social linking and unlinking
    const [openSocialLinkingDlg, setOpenSocialLinkingDlg] =
        useState<boolean>(false)

    // add licenses on profile
    const [openAddLicensesDlg, setOpenAddLicensesDlg] = useState<boolean>(false)

    // add images on profile
    const [openAddImageDlg, setOpenAddImageDlg] = useState<boolean>(false)

    // add description
    const [openAddDescriptionDlg, setOpenAddDescriptionDlg] =
        useState<boolean>(false)

    // add video link
    const [openAddVideoDlg, setOpenAddVideoDlg] = useState<boolean>(false)

    const [editedSectionId, setEditedSectionId] = useState<number>()

    // licenses
    const [allLicenses, setAllLicenses] = useState<Array<any>>()

    // current user's info
    const authorization = useSelector(
        (state: { authorization: any }) => state.authorization,
    )

    // social linking
    const [searchParams] = useSearchParams()

    const [twitchData, setTwitchData] = useState(null)

    const urlParams = new URLSearchParams(window.location.search)
    const queryCode = urlParams.get('code')
    const [instaUser, setInstaUser] = useState({ id: '', username: '' })

    const fetchInstagramProfile = async (authorizationCode: any) => {
        const code = authorizationCode
        const dataObj = {
            clientID: `${Instagram.client_id}`,
            clientSecret: `${Instagram.client_secret}`,
            redirectURI: `${Instagram.callback_url}`,
            grantType: 'authorization_code',
            url: `/api/instagram`,
            code: `${code}`,
        }
        const data = new URLSearchParams()
        data.append('client_id', dataObj.clientID)
        data.append('client_secret', dataObj.clientSecret)
        data.append('grant_type', dataObj.grantType)
        data.append('redirect_uri', dataObj.redirectURI)
        data.append('code', dataObj.code)

        const response = await fetch(dataObj.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: data.toString(),
        })
        const { accessToken } = await response.json()
        const profileUrl = `https://graph.instagram.com/me?fields=id,username&access_token=${accessToken}`
        const profileResponse = await fetch(profileUrl)
        if (profileResponse.ok) {
            const profile = await profileResponse.json()
            setInstaUser(profile)
            // Cookies.set('user', profile?.username);
            // Cookies.set('user-id', profile?.id);
            localStorage.setItem('instagram-user', JSON.stringify(profile))
            console.log(`Instagram - User logged In ${profile?.username}`)
            console.log('Instagram - profile message', profile?.message)
        } else {
            console.error('Failed to get profile', profileResponse)
        }
    }
    const exchangeCodeForToken = async (code: any) => {
        const authorizationCode = code
        const dataObj = {
            url: `/api/twitch`,
            code: `${authorizationCode}`,
        }
        const data = new URLSearchParams()
        data.append('code', dataObj.code)

        const response = await fetch('/api/twitch', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code }),
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.message)
        }

        const dataRes = await response.json()
        console.log('the response', dataRes)
        setTwitchData(dataRes)
        localStorage.setItem('twitch-user', dataRes)
        console.log('dataRes?.message', dataRes?.message)
    }

    useEffect(() => {
        if (queryCode) {
            setOpenSocialLinkingDlg(true)
            if (window.location.pathname.includes('instagram-auth')) {
                fetchInstagramProfile(queryCode)
            } else {
                if (window.location.pathname.includes('twitch-auth')) {
                    exchangeCodeForToken(queryCode)
                }
            }
        }
    }, [queryCode])

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        const currentTab = tabPages.find((item) => item.tabName === newValue)
        setTabValue(newValue)
        setCurrentTabIdx(currentTab.id)
    }

    const tabNameHandler = (newTab: string) => {
        const tmp = tabPages
        tmp.push({
            id: tabPages[tabPages.length - 1].id + 1,
            tabName: newTab,
            tabPage: [],
        })
        setTabPages(tmp)
        setOpenTabDlg(false)
    }

    const sectionHandler = (type: SectionTypes) => {
        let tmp = tabPages
        switch (type) {
            case SectionTypes.AddLicenseShowcaseSection:
            case SectionTypes.AddMusicPreviewSection:
                tmp = tabPages.map((item) => {
                    if (item.id === currentTabIdx) {
                        item.tabPage.push({
                            id: item.tabPage.length,
                            sectionName: '',
                            sectionType: type,
                            data: { size: SizeTypes.Small, contents: [] },
                        })
                    }
                    return item
                })
                setTabPages(tmp)
                setOpenPickDlg(false)
                break
            case SectionTypes.AddDescriptionSection:
            case SectionTypes.AddImageSection:
            case SectionTypes.AddVideoSection:
                tmp = tabPages.map((item) => {
                    if (item.id === currentTabIdx) {
                        item.tabPage.push({
                            id: item.tabPage.length,
                            sectionName: '',
                            sectionType: type,
                            data: [],
                        })
                    }
                    return item
                })
                setTabPages(tmp)
                setOpenPickDlg(false)
                break
            default:
                break
        }
    }

    const addItemHandler = (sectionId: number, type: SectionTypes) => {
        setEditedSectionId(sectionId)
        switch (type) {
            case SectionTypes.AddLicenseShowcaseSection:
                setOpenAddLicensesDlg(true)
                break
            case SectionTypes.AddImageSection:
                setOpenAddImageDlg(true)
                break
            case SectionTypes.AddMusicPreviewSection:
                setOpenAddLicensesDlg(true)
                break
            case SectionTypes.AddDescriptionSection:
                setOpenAddDescriptionDlg(true)
                break
            case SectionTypes.AddVideoSection:
                setOpenAddVideoDlg(true)
                break
            default:
                break
        }
    }

    const contactInfoHandler = async (
        phoneNumber: string,
        showPhoneNumber: boolean,
        contactEmail: string,
        showContactEmail: boolean,
    ) => {
        const currentContactInfo = {
            phoneNumber,
            showPhoneNumber,
            contactEmail,
            showContactEmail,
        }
        setContactInfo(currentContactInfo)
        const publicProfilePage = {
            platformTitle: mediaName,
            avatarImage,
            bannerImage,
            userName,
            contactInfo: currentContactInfo,
            followers,
            etherScanLink,
            socialLinks,
            tabPages,
        }
        console.log('publicProfilePage', publicProfilePage)
        const res = await savePublicProfile(
            authorization?.currentUser.id,
            mediaName,
            publicProfilePage,
        )
        if (res.status === 200) {
            toast.success(res.data.msg)
        } else {
            toast.error(res.data.msg)
        }
    }

    const saveSocialLinks = (socialPlatforms: Array<any>) => {}

    const addLicenses = (licenses: Array<any>, type: SectionTypes) => {
        const sectionId = editedSectionId
        const tmp = tabPages.map((item) => {
            if (item.id === currentTabIdx) {
                item.tabPage.map((ele) => {
                    if (ele.id === sectionId) {
                        let tmpContents = ele.data.contents
                        tmpContents = [].concat(tmpContents, licenses)
                        ele.data.contents = tmpContents
                    }
                })
            }
            return item
        })
        setTabPages(tmp)
    }

    const addImages = async (files, imageSize: SizeTypes) => {
        const sectionId = editedSectionId
        const tmp = tabPages.map((item) => {
            if (item.id === currentTabIdx) {
                item.tabPage.map((ele) => {
                    if (ele.id === sectionId) {
                        let tmpContents = ele.data
                        tmpContents = [].concat(tmpContents, {
                            size: imageSize,
                            imagePath: URL.createObjectURL(files[0]),
                            imageFile: files[0],
                        })
                        ele.data = tmpContents
                    }
                })
            }
            return item
        })
        setTabPages(tmp)
    }

    const addDescription = (textSize: SizeTypes) => {
        const sectionId = editedSectionId
        const tmp = tabPages.map((item) => {
            if (item.id === currentTabIdx) {
                item.tabPage.map((ele) => {
                    if (ele.id === sectionId) {
                        let tmpContents = ele.data
                        tmpContents = [].concat(tmpContents, {
                            size: textSize,
                            text: '',
                        })
                        ele.data = tmpContents
                    }
                })
            }
            return item
        })
        setTabPages(tmp)
    }

    const addVidoes = (videoLink) => {
        const sectionId = editedSectionId
        const tmp = tabPages.map((item) => {
            if (item.id === currentTabIdx) {
                item.tabPage.map((ele) => {
                    if (ele.id === sectionId) {
                        let tmpContents = ele.data
                        tmpContents = [].concat(tmpContents, {
                            size: SizeTypes.Large,
                            videoUrl: videoLink,
                        })
                        ele.data = tmpContents
                    }
                })
            }
            return item
        })
        setTabPages(tmp)
    }

    useEffect(() => {
        const init = async () => {
            if (authorization?.currentUser?.id) {
                const res = await getPublicProfile(
                    authorization?.currentUser?.id,
                    mediaName,
                )
                if (res.status === 200 && res.data.success) {
                    const profileData = res.data.data.profileData
                    setUserName(profileData.userName)
                    if (profileData?.avatarImage?.imagePath) {
                        setAvatarImage({
                            imagePath: `${profileData?.avatarImage?.imagePath}`,
                            imageFile: null,
                        })
                    }
                    if (profileData?.bannerImage?.imagePath) {
                        setBannerImage({
                            imagePath: `${profileData?.bannerImage?.imagePath}`,
                            imageFile: null,
                        })
                    }
                    setSocialLinks(profileData.socialLinks)

                    setContactInfo(profileData.contactInfo)

                    setTabPages(profileData.tabPages)
                    setTabValue(profileData.tabPages[0].tabName)
                }
            }
            if (
                authorization?.currentUser?.walletAddress &&
                authorization?.currentUser?.walletAddress !== ''
            ) {
                setAllLicenses([])
            }
        }
        init()
    }, [
        authorization?.currentUser?.walletAddress,
        authorization?.currentUser?.id,
        mediaName,
    ])

    const swapElements = (array, index1, index2) => {
        const temp = array[index1]
        array[index1] = array[index2]
        array[index2] = temp
        return array
    }

    const moveSection = useCallback(
        (dragIndex: number, hoverIndex: number) => {
            const tmpTabPages = tabPages.map((item) => {
                if (item.id === currentTabIdx) {
                    const tmpTabPage = swapElements(
                        item.tabPage,
                        dragIndex,
                        hoverIndex,
                    )
                    return { ...item, tabPage: tmpTabPage }
                } else {
                    return item
                }
            })
            setTabPages(tmpTabPages)
        },
        [currentTabIdx, tabPages],
    )

    const renderCard = useCallback(
        (
            section: {
                id: number
                sectionName: string
                sectionType: SectionTypes
                data: any
            },
            index: number,
            tabIdx: number,
        ) => {
            return (
                <SectionCard
                    key={section.id}
                    tabIdx={tabIdx}
                    index={index}
                    id={section.id}
                    text={section.sectionName}
                    type={section.sectionType}
                    sections={section.data}
                    moveSection={moveSection}
                    addItemHandler={addItemHandler}
                    tabPages={tabPages}
                    setTabPages={setTabPages}
                />
            )
        },
        [moveSection, tabPages, setTabPages],
    )

    const saveHandler = async () => {
        let publicProfilePage = {
            platformTitle: mediaName,
            avatarImage,
            bannerImage,
            userName,
            contactInfo,
            followers,
            etherScanLink,
            socialLinks,
            tabPages,
        }
        if (avatarImage?.imagePath) {
            // const avatarRes = await uploadProfileImage(
            //     avatarImage.imageFile,
            //     authorization?.currentUser?.id,
            //     mediaName,
            // )
            // if (avatarRes.status === 200 && avatarRes.data.success) {
            //     publicProfilePage = {
            //         ...publicProfilePage,
            //         avatarImage: {
            //             imagePath: avatarRes.data.data,
            //             imageFile: null,
            //         },
            //     }
            // } else {
            //     toast.error('could not upload avatar image')
            //     return
            // }
            publicProfilePage = {
                ...publicProfilePage,
                avatarImage: {
                    imagePath: avatarImage.imagePath,
                    imageFile: null,
                },
            }
        }

        if (bannerImage?.imagePath) {
            // const bannerRes = await uploadProfileImage(
            //     bannerImage.imageFile,
            //     authorization?.currentUser?.id,
            //     mediaName,
            // )
            // if (bannerRes.status === 200 && bannerRes.data.success) {
            //     publicProfilePage = {
            //         ...publicProfilePage,
            //         bannerImage: {
            //             imagePath: bannerRes.data.data,
            //             imageFile: null,
            //         },
            //     }
            // } else {
            //     toast.error('could not upload banner image')
            //     return
            // }
            publicProfilePage = {
                ...publicProfilePage,
                bannerImage: {
                    imagePath: bannerImage.imagePath,
                    imageFile: null,
                },
            }
        }

        const tmpTabPages = await Promise.all(
            tabPages.map(async (tabPageItem) => {
                const tmpTabPageItem = await Promise.all(
                    tabPageItem.tabPage.map(async (section) => {
                        if (
                            section.sectionType === SectionTypes.AddImageSection
                        ) {
                            const tmpData = await Promise.all(
                                section.data.map(async (item) => {
                                    if (item.imageFile) {
                                        const imageRes =
                                            await uploadProfileImage(
                                                item.imageFile,
                                                authorization?.currentUser?.id,
                                                mediaName,
                                            )
                                        if (
                                            imageRes.status === 200 &&
                                            imageRes.data.success
                                        ) {
                                            return {
                                                ...item,
                                                imageFile: null,
                                                imagePath: imageRes.data.data,
                                            }
                                        } else {
                                            console.log('upload error', item)
                                            toast.error(
                                                `could not upload section image`,
                                            )
                                            return item
                                        }
                                    } else {
                                        return item
                                    }
                                }),
                            )
                            return { ...section, data: tmpData }
                        } else {
                            return section
                        }
                    }),
                )
                return { ...tabPageItem, tabPage: tmpTabPageItem }
            }),
        )
        publicProfilePage = { ...publicProfilePage, tabPages: tmpTabPages }

        const res = await savePublicProfile(
            authorization?.currentUser.id,
            mediaName,
            publicProfilePage,
        )
        if (res.status === 200) {
            toast.success(res.data.msg)
        } else {
            toast.error(res.data.msg)
        }
    }

    const publishHandler = async () => {
        if (authorization?.currentUser?.id) {
            const res = await publishPublicProfile(
                authorization.currentUser.id,
                mediaName,
            )
            if (res.status === 200) {
                toast.success(res.data.msg)
            } else {
                toast.error(res.data.msg)
            }
        } else {
            toast.error('please login again')
        }
    }

    const unPublishHandler = async () => {
        if (authorization?.currentUser?.id) {
            const res = await unPublishPublicProfile(
                authorization.currentUser.id,
                mediaName,
            )
            if (res.status === 200) {
                toast.success(res.data.msg)
            } else {
                toast.error(res.data.msg)
            }
        } else {
            toast.error('please login again')
        }
    }

    const bannerHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const toastUploading = toast.loading('Uploading Banner Image...')

        const file = event.target.files[0]
        if (file) {
            if (bannerImage?.imagePath) {
                const deletedRef = ref(storage, bannerImage.imagePath)

                deleteObject(deletedRef)
                    .then(() => {
                        console.log('Bucket deleted successfully.')
                    })
                    .catch((error) => {
                        console.error('Error deleting bucket:', error)
                    })
            }

            const storageRef = ref(
                storage,
                `/banners/${authorization.currentUser.artistId}/${file.name}`,
            )
            const uploadTask = uploadBytesResumable(storageRef, file)
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const percent = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
                    ) // update progress
                },
                (err) =>
                    toast.error('Something went wrong', { id: toastUploading }),
                () => {
                    // download url
                    getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                        setBannerImage({
                            imagePath: url,
                            imageFile: event.target.files[0],
                        })
                        toast.success('Uploaded Banner Image', {
                            id: toastUploading,
                        })
                    })
                },
            )
        }
    }

    const avatarHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const toastUploading = toast.loading('Uploading Avatar Image...')
        const file = event.target.files[0]
        if (file) {
            if (avatarImage?.imagePath) {
                const deletedRef = ref(storage, avatarImage.imagePath)

                deleteObject(deletedRef)
                    .then(() => {
                        console.log('Bucket deleted successfully.')
                    })
                    .catch((error) => {
                        console.error('Error deleting bucket:', error)
                    })
            }

            const storageRef = ref(
                storage,
                `/avatars/${authorization.currentUser.artistId}/${file.name}`,
            )
            const uploadTask = uploadBytesResumable(storageRef, file)
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const percent = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
                    ) // update progress
                },
                (err) =>
                    toast.error('Something went wrong', { id: toastUploading }),
                () => {
                    // download url
                    getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                        setAvatarImage({
                            imagePath: url,
                            imageFile: file,
                        })
                        toast.success('Uploaded Avatar Image', {
                            id: toastUploading,
                        })
                    })
                },
            )
        }
    }

    const goToProfilePage = async () => {
        try {
            const res = await getPublicProfile(
                authorization?.currentUser?.id,
                'Spotify',
            )
            if (res.status === 200 && res.data.success) {
                navigate(
                    `/view-profile/${mediaName}/${authorization?.currentUser?.id}/1`,
                )
            } else {
                toast.error('This artist does not have public profile')
            }
        } catch (e) {
            console.log('error in getting public profile')
            toast.error('Something went wrong')
        }
    }

    return (
        <Container>
            <Box display={'flex'} justifyContent={'center'}>
                <Box display={'flex'} width="90%">
                    <Box sx={{ display: 'flex' }}>
                        <SecondaryButton onClick={() => saveHandler()}>
                            Save Edits
                        </SecondaryButton>
                        <SecondaryButton
                            sx={{ paddingLeft: '20px' }}
                            onClick={() => unPublishHandler()}
                        >
                            Unpublish
                        </SecondaryButton>
                    </Box>
                    <Box sx={{ display: 'felx', marginLeft: 'auto' }}>
                        <SecondaryButton onClick={() => goToProfilePage()}>
                            Preview
                        </SecondaryButton>
                        <SecondaryButton
                            sx={{ marginLeft: 'auto' }}
                            onClick={() => publishHandler()}
                        >
                            Publish
                        </SecondaryButton>
                    </Box>
                </Box>
            </Box>
            {/* banner image */}
            <input
                accept="image/*"
                className={classes.input}
                style={{ display: 'none' }}
                id="banner-image-file"
                type="file"
                onChange={bannerHandler}
            />
            <label htmlFor="banner-image-file">
                <UploadImageContainer>
                    {bannerImage ? (
                        <UploadImage
                            src={
                                bannerImage?.imageFile
                                    ? bannerImage.imagePath
                                    : `${bannerImage.imagePath}`
                            }
                        />
                    ) : (
                        <UploadImage
                            sx={{
                                maxHeight: '100px',
                                width: '100px',
                                borderRadius: '10px',
                            }}
                            src={defaultSrc}
                        />
                    )}
                </UploadImageContainer>
            </label>
            {/* avatar image */}
            <input
                accept="image/*"
                className={classes.input}
                style={{ display: 'none' }}
                id="avatar-image-file"
                type="file"
                onChange={avatarHandler}
            />
            <label htmlFor="avatar-image-file">
                <PublicAvatarImageContainer>
                    {avatarImage ? (
                        <AvatarImage
                            src={
                                avatarImage?.imageFile
                                    ? avatarImage.imagePath
                                    : `${avatarImage.imagePath}`
                            }
                            sx={{
                                width: '100%',
                                height: '100%',
                                borderRadius: '100%',
                                padding: '0px',
                            }}
                        />
                    ) : (
                        <AvatarImage src={avatarArc} />
                    )}
                </PublicAvatarImageContainer>
            </label>

            <ContainerFluid display="flex">
                {editableName ? (
                    <Input
                        placeholder="Write your name"
                        inputProps={{ 'aria-label': 'description' }}
                        onBlur={() => setEditableName(false)}
                        onChange={(e) => setUserName(e.target.value)}
                        value={userName}
                        sx={{ width: '200px', padding: theme.spacing(0, 1) }}
                    />
                ) : (
                    <PersonaLabel onClick={() => setEditableName(true)}>
                        {userName && userName !== ''
                            ? userName
                            : 'Entered Name'}
                    </PersonaLabel>
                )}

                <SecondaryButton onClick={() => setOpenContactDlg(true)}>
                    Contact
                </SecondaryButton>
                <SecondaryButton>Etherscan</SecondaryButton>
                <SecondaryButton
                    sx={{ marginLeft: 'auto' }}
                    onClick={() => setOpenSocialLinkingDlg(true)}
                >
                    Accounts
                </SecondaryButton>
            </ContainerFluid>
            <TabsContainer>
                <Box width="100%" position="relative">
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '8px',
                            left: '-32px',
                            borderBottom: '1px solid #d3d3d3',
                        }}
                    >
                        <IconButton onClick={() => setOpenTabDlg(true)}>
                            <AddIcon />
                        </IconButton>
                    </Box>
                    <StyledTabs
                        value={tabValue}
                        onChange={handleChange}
                        textColor="secondary"
                        indicatorColor="secondary"
                        aria-label="secondary tabs example"
                    >
                        {tabPages?.map((tabPage, idx) => {
                            return (
                                <StyledTab
                                    value={tabPage.tabName}
                                    label={tabPage.tabName}
                                    key={idx}
                                />
                            )
                        })}
                    </StyledTabs>
                    <OutlinedInput
                        placeholder="Search"
                        className={classes.searchInput}
                        value={keyword}
                        onChange={(
                            e: React.ChangeEvent<
                                HTMLTextAreaElement | HTMLInputElement
                            >,
                        ) => {
                            setKeyword(e.target.value)
                        }}
                        type="text"
                        required
                    />
                </Box>
            </TabsContainer>
            {tabValue !== 'All License' ? (
                <>
                    <ContainerFluid>
                        {tabPages[currentTabIdx]?.tabPage?.map((item, i) => {
                            return (
                                <div key={i}>
                                    {renderCard(item, i, currentTabIdx)}
                                </div>
                            )
                        })}
                    </ContainerFluid>
                    <ContainerFluid>
                        <SecondaryButton
                            sx={{ width: '100%', margin: '10px 0px' }}
                            onClick={() => setOpenPickDlg(true)}
                        >
                            Add Section and pick Type
                        </SecondaryButton>
                    </ContainerFluid>
                </>
            ) : (
                <ContainerFluid>
                    <Grid container spacing={2}>
                        {allLicenses &&
                            allLicenses.map((license, idx) => {
                                return (
                                    <Grid item xs={3} key={idx}>
                                        <IPCard
                                            type={IPCardBoxType.None}
                                            imageSrc={license.imagePath}
                                            title={license.licenseName}
                                        />
                                    </Grid>
                                )
                            })}
                    </Grid>
                </ContainerFluid>
            )}
            <TabNameDialog
                open={openTabDlg}
                setOpen={setOpenTabDlg}
                handler={tabNameHandler}
            />
            <PickDialog
                open={openPickDlg}
                setOpen={setOpenPickDlg}
                handler={sectionHandler}
            />
            <AddLicensesDialog
                open={openAddLicensesDlg}
                type={SectionTypes.AddLicenseShowcaseSection}
                setOpen={setOpenAddLicensesDlg}
                handler={addLicenses}
            />
            <AddLicensesDialog
                open={openAddLicensesDlg}
                type={SectionTypes.AddMusicPreviewSection}
                setOpen={setOpenAddLicensesDlg}
                handler={addLicenses}
            />
            <AddImageDialog
                open={openAddImageDlg}
                setOpen={setOpenAddImageDlg}
                handler={addImages}
            />
            <AddDescriptionDialog
                open={openAddDescriptionDlg}
                setOpen={setOpenAddDescriptionDlg}
                handler={addDescription}
            />
            <AddVideoDialog
                open={openAddVideoDlg}
                setOpen={setOpenAddVideoDlg}
                handler={addVidoes}
            />
            <SocialLinkingDialog
                socialLinks={socialLinks}
                setSocialLinks={setSocialLinks}
                open={openSocialLinkingDlg}
                setOpen={setOpenSocialLinkingDlg}
                handler={saveSocialLinks}
            />
        </Container>
    )
}

export default EditablePublicProfile
