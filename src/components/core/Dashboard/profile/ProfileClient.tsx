"use client"
import {
  Box, Grid, Stack, Typography, Icon, List, ListItem, Checkbox, FormControlLabel, DialogActions,
  DialogContent
} from "@mui/material"
import React from "react"
import { CustomButtonRounded } from "@/components/ui/Dashboard/CustomButtonRounded"
import Image from "next/image"
import Link from "next/link"
import InvestorProfileTable from "@/styledComponents/Profile/InvesterProfileTable"
import ProfileDocumentsDisplay from "@/components/ui/Dashboard/ProfileDocumentsDisplay"
import { ProfileClientStyled } from "@/styledComponents/Profile/ProfileClientStyled"
import DashboardModal from "@/components/ui/Dashboard/DashboardModal"
import { CustomButtonTransparent } from "@/components/ui/Dashboard/CustomButtonTransparent"
import ChechBoxIcon from "@/components/ui/icons/ChechBoxIcon"
import CheckBoxCheckedIcon from "@/components/ui/icons/CheckBoxCheckedIcon"
import { API_BASE_URL } from "@/lib/auth-api"
import { getAccessToken } from "@/lib/auth-session"
import { ProfileDocument } from "@/lib/profileDocuments"
import ProfileClientSkeleton from "./ProfileClientSkeleton"
import { buildProfileDisplayData } from "./profileDisplay"

type ProfileApiResponse = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  profile?: any
  message?: string
  error?: string
}

type SignReadUploadResponse = {
  url?: string
  key?: string
  error?: string
}

const ProfileClient = () => {
  const [open, setOpen] = React.useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [profile, setProfile] = React.useState<any>(null)
  const [avatarSrc, setAvatarSrc] = React.useState<string>("/assets/images/profile-avatar.svg")
  const [isLoadingHeader, setIsLoadingHeader] = React.useState(true)
  const [openingDocumentId, setOpeningDocumentId] = React.useState<string | null>(null)

  const handleLogoutModal = () => {
    setOpen(true)
  }

  const getSignedReadableImageUrl = React.useCallback(async (token: string, rawUrl: string) => {
    const response = await fetch(`${API_BASE_URL}/uploads/sign-read`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ url: rawUrl, expiresIn: 1800 }),
    })

    const data = (await response.json().catch(() => ({}))) as SignReadUploadResponse
    if (!response.ok || !data.url) {
      throw new Error(data.error || "Failed to generate signed read url")
    }

    return data.url
  }, [])

  const getSignedReadableUploadUrl = React.useCallback(async (token: string, source: { key?: string; url?: string }) => {
    const response = await fetch(`${API_BASE_URL}/uploads/sign-read`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...source, expiresIn: 1800 }),
    })

    const data = (await response.json().catch(() => ({}))) as SignReadUploadResponse
    if (!response.ok || !data.url) {
      throw new Error(data.error || "Failed to generate signed read url")
    }

    return data.url
  }, [])

  const loadProfileHeader = React.useCallback(async () => {
    setIsLoadingHeader(true)
    try {
      const token = getAccessToken()
      if (!token) {
        setIsLoadingHeader(false)
        return
      }

      const response = await fetch(`${API_BASE_URL}/profiles/getme`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = (await response.json().catch(() => ({}))) as ProfileApiResponse
      if (!response.ok || !data.profile) {
        setIsLoadingHeader(false)
        return
      }

      setProfile(data.profile)

      if (data.profile.profilePhoto) {
        try {
          const signedReadUrl = await getSignedReadableImageUrl(token, data.profile.profilePhoto)
          setAvatarSrc(signedReadUrl)
        } catch {
          setAvatarSrc(data.profile.profilePhoto)
        }
      }
    } catch {
    } finally {
      setIsLoadingHeader(false)
    }
  }, [getSignedReadableImageUrl])

  React.useEffect(() => {
    loadProfileHeader()
  }, [loadProfileHeader])

  const {
    roleType,
    nameWithAge,
    roleLabel,
    companyLinePrimary,
    companyLineSecondary,
    locationLinePrimary,
    isVerified,
    keyDataItems,
    documents,
    aboutItems,
    detailItems,
    socialLinks,
  } = React.useMemo(() => buildProfileDisplayData(profile), [profile])

  // Split detail fields by *shape* so long-form essays (e.g. "Use of Funds")
  // and URLs never get crammed into the compact scalar grid — that uneven
  // height is what produced the giant empty cards.
  const { statItems, linkItems, longItems } = React.useMemo(() => {
    const isUrl = (value: string) => /^(https?:)?\/\//i.test(value.trim())
    const isLongForm = (value: string) => value.trim().length > 90 || /\r?\n/.test(value)

    const stats: { label: string; value: string }[] = []
    const links: { label: string; value: string }[] = []
    const longs: { label: string; value: string }[] = []

    for (const item of detailItems) {
      const value = String(item.value ?? "")
      if (isUrl(value)) links.push({ label: item.label, value })
      else if (isLongForm(value)) longs.push({ label: item.label, value })
      else stats.push({ label: item.label, value })
    }

    return { statItems: stats, linkItems: links, longItems: longs }
  }, [detailItems])

  const hasDetails = statItems.length > 0 || linkItems.length > 0 || longItems.length > 0

  const isExternalAvatar = /^(https?:)?\/\//.test(avatarSrc) || avatarSrc.startsWith("data:") || avatarSrc.startsWith("blob:")

  const handleOpenDocument = React.useCallback(async (document: ProfileDocument) => {
    const token = getAccessToken()
    if (!token) {
      return
    }

    if (!document.url && !document.key) {
      return
    }

    setOpeningDocumentId(document.documentId)

    try {
      const signedUrl = await getSignedReadableUploadUrl(
        token,
        document.url ? { url: document.url } : { key: document.key },
      )
      window.open(signedUrl, "_blank", "noopener,noreferrer")
    } catch {
    } finally {
      setOpeningDocumentId(null)
    }
  }, [getSignedReadableUploadUrl])

  if (isLoadingHeader) {
    return <ProfileClientSkeleton />
  }

  return (
    <ProfileClientStyled>
      <Grid container spacing={2.5}>

        {/* left sec  */}
        <Grid size={{ xs: 12, xl: 5, md: 6 }}>
          <Box className="profileLeft">
            <Box sx={{ position: "relative" }}>
              <figure className='profileLeftImgWrap'>
                <Image
                  src={avatarSrc}
                  alt='avatar'
                  width={420}
                  height={370}
                  unoptimized={isExternalAvatar}
                />
              </figure>
            </Box>

            {socialLinks.length > 0 && (
              <Stack direction="row" spacing={2.5} justifyContent="center" alignItems="center" marginBottom={2.5}>
                {socialLinks.map((item, index) => (
                  <Box key={`${item.socialname}-${index}`}>
                    <Link href={item.href as string} className='profileSocialLinks' target="_blank" rel="noreferrer">
                      <Image src={item.icon} alt={`${item.socialname} icon`} width={24} height={24} />
                    </Link>
                  </Box>
                ))}
              </Stack>
            )}

            <Grid container spacing={1.2}>
              <Grid size={{ xs: 6 }}>
                <CustomButtonRounded
                  variant='contained'
                  color='primary'
                  fullWidth
                  component={Link}
                  href="/dashboard/profile/edit"
                >
                  Edit Profile
                </CustomButtonRounded>

              </Grid>

              <Grid size={{ xs: 6 }}>
                <CustomButtonRounded variant='contained' color='error' fullWidth
                  onClick={handleLogoutModal} >
                  Logout
                </CustomButtonRounded>

                {open && (
                  <DashboardModal
                    open={open}
                    onClose={() => setOpen(false)}
                    maxWidth="sm"
                    title='Logout'
                  >
                    <Box className="logout_modal_inner_wrap">
                      <DialogContent>
                        <Icon className='logout_icon_wrap' sx={{ width: "auto", height: "auto", display: "flex", mb: 1.2 }}>
                          <Image width={48} height={48} src="/assets/icons/logout-icon.svg" alt="logout icon" />
                        </Icon>
                        <Typography
                          className='logout_text'>
                          See you soon! Ready to log out? ?
                        </Typography>
                      </DialogContent>

                      <DialogActions >
                        <Grid container columnSpacing={1.2}>
                          <Grid size={{ xs: 6 }}>
                            <CustomButtonTransparent
                              fullWidth
                            >
                              Cancel
                            </CustomButtonTransparent>
                          </Grid>
                          <Grid size={{ xs: 6 }} >
                            <CustomButtonRounded
                              variant='contained'
                              color='error'
                              fullWidth
                            >
                              Proceed
                            </CustomButtonRounded>
                          </Grid>

                          <Grid size={{ xs: 12 }}>
                            <FormControlLabel
                              className='checkbox_inp_cont'
                              control={
                                <Checkbox
                                  color="primary"
                                  icon={<ChechBoxIcon width='22' height='22' />}
                                  checkedIcon={<CheckBoxCheckedIcon width='22' height='22' />}
                                />
                              }
                              label="Don't show again"
                            />
                          </Grid>
                        </Grid>
                      </DialogActions>
                    </Box>
                  </DashboardModal>
                )}
              </Grid>
            </Grid>
          </Box>
        </Grid>

        {/* right sec  */}

        <Grid size={{ xs: 12, xl: 7, md: 6 }}>
          <Box className="profileRight">

            {/* Identity */}
            <Box className="profileIdentity">
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Typography component="h2" className="identityName">
                  {nameWithAge}
                </Typography>
                {isVerified && (
                  <Icon sx={{ width: "auto", height: "auto", display: "flex" }}>
                    <Image src="/assets/icons/verified-greenTick-profile.svg" alt="verified icon" width={16} height={16} />
                  </Icon>
                )}
              </Stack>
              <Typography className="identityRole">{roleLabel}</Typography>

              <List disablePadding className="banner_list_company">
                {companyLinePrimary && <ListItem disablePadding>{companyLinePrimary}</ListItem>}
                {companyLineSecondary && <ListItem disablePadding>{companyLineSecondary}</ListItem>}
              </List>

              <Stack className="profile_rightSec_address_cont" direction="row" spacing={1}>
                <Icon sx={{ width: "auto", height: "auto", display: "flex", mt: "2px" }}>
                  <Image src="/assets/icons/location-icon-profile-right.svg" alt="location icon" width={16} height={16} />
                </Icon>
                <List disablePadding className="banner_list_address">
                  <ListItem disablePadding>{locationLinePrimary}</ListItem>
                </List>
              </Stack>
            </Box>

            {/* Profile Details */}
            {hasDetails && (
              <Box className="profileSection">
                <Typography className="sectionHeader">Profile Details</Typography>

                {statItems.length > 0 && (
                  <Box className="statGrid">
                    {statItems.map((item) => (
                      <Box key={item.label} className="statCard">
                        <Typography component="span" className="statLabel">{item.label}</Typography>
                        <Typography component="span" className="statValue">{item.value}</Typography>
                      </Box>
                    ))}
                  </Box>
                )}

                {(linkItems.length > 0 || longItems.length > 0) && (
                  <Box className="panelStack">
                    {linkItems.map((item) => (
                      <Box key={item.label} className="fieldPanel">
                        <Typography component="span" className="panelLabel">{item.label}</Typography>
                        <Link href={item.value} target="_blank" rel="noreferrer" className="panelLink">
                          {item.value}
                        </Link>
                      </Box>
                    ))}
                    {longItems.map((item) => (
                      <Box key={item.label} className="fieldPanel">
                        <Typography component="span" className="panelLabel">{item.label}</Typography>
                        <Typography className="panelText">{item.value}</Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            )}

            {/* About */}
            <Box className="profileSection">
              <Typography className="sectionHeader">About</Typography>
              {aboutItems.length > 0 ? (
                <Box className="aboutList">
                  {aboutItems.map((textContent: string, index: number) => (
                    <Box key={index} className="aboutItem">
                      {aboutItems.length > 1 && (
                        <Typography component="span" className="aboutIndex">{index + 1}.</Typography>
                      )}
                      <Typography component="p" className="aboutText">{textContent}</Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography className="emptyHint">
                  Add about text from Edit Profile to show it here.
                </Typography>
              )}
            </Box>

            {/* Key Data */}
            <Box className="profileSection">
              <Typography className="sectionHeader">Key Data</Typography>
              <InvestorProfileTable
                role={roleType}
                items={keyDataItems}
                emptyMessage="Add key data from Edit Profile to show quick profile snapshots here."
              />
            </Box>

            {/* Documents */}
            <Box className="profileSection">
              <Typography className="sectionHeader">Documents</Typography>
              <ProfileDocumentsDisplay
                documents={documents}
                openingDocumentId={openingDocumentId}
                onOpen={handleOpenDocument}
                emptyMessage="Add documents from Edit Profile to show them here."
              />
            </Box>

          </Box>
        </Grid>

      </Grid>
    </ProfileClientStyled>
  )
}

export default ProfileClient
