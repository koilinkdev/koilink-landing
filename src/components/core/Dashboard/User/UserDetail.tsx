"use client"
import { common} from '@/theme/palette'
import { Box, Grid, Stack,Typography, Icon, List, ListItem } from '@mui/material'
import React from 'react'
import { CustomButtonRoundedWithIcon } from '@/components/ui/Dashboard/CustomRoundedButtonWithIcon'
import Image from 'next/image'
import Link from 'next/link'
import InvestorProfileTable from '@/styledComponents/Profile/InvesterProfileTable'
import ProfileDocumentsDisplay from '@/components/ui/Dashboard/ProfileDocumentsDisplay'
import {UserDetailStyled} from '@/styledComponents/User/UserDetailStyled'

const profileRightSecAboutData = [
    {
        textContent: "Investor high-net-worth investor focused on seed-stage SaaS and AI startups. Typically invest $100K–$1M with 20%+ ROI targets. Portfolio includes 3 successful exits."
    },
    {
        textContent: "Company pre-revenue cleantech startup developing solar-powered IoT devices. Seeking $500K seed funding to launch MVP. Projected $2M revenue by Year 3."
    },
]

const demoKeyDataRows = [
    {
        field: "focus-areas",
        investor: "SaaS, AI and marketplace businesses with early product-market fit.",
        company: "B2B workflow tools for operations-heavy teams.",
    },
    {
        field: "funding-range",
        investor: "$100K to $1M initial cheque size with room for follow-on.",
        company: "Raising $500K to ship MVP and open pilot partnerships.",
    },
]

const demoDocuments = [
    {
        documentId: "pitch-deck-demo",
        type: "pitch_deck",
        size: 1400000,
        metadata: { fileName: "Tattvera Pitch Deck.pdf" },
    },
    {
        documentId: "financials-demo",
        type: "financial_statements",
        size: 820000,
        metadata: { fileName: "Financial Statements FY25.pdf" },
    },
]


const UserDetail = () => {
    return (
        <UserDetailStyled>
            <Grid container spacing={2.5}>

                {/* left sec  */}
                <Grid size={{ xs: 12, xl: 5 ,md:6 }}>
                    <Box className="profileLeft">
                        <Box sx={{ position: "relative" }}>
                            <figure className='profileLeftImgWrap'>
                                <Image src='/assets/icons/userPage-avatar.svg' alt='' width={420} height={370} />
                            </figure>
                        </Box>



                        <Grid container spacing={1.2}>
                            <Grid size={{ xs: 6 }}>
                                <CustomButtonRoundedWithIcon
                                component={Link}
                                href="/dashboard/videoCall"
                                variant='contained' color='primary' fullWidth
                                 icon={
                                 <Icon sx={{width:"auto",height:"auto",display:"flex"}}>
                                     <Image src='/assets/icons/dial-icon-user.svg' alt='dial-icon' width={20} height={20} />
                                  </Icon>
                                } 
                                 >
                                    Video Call
                                </CustomButtonRoundedWithIcon>

                            </Grid>

                            <Grid size={{ xs: 6 }}>
                                 <CustomButtonRoundedWithIcon
                                variant='contained' color='primary' fullWidth
                                 icon={
                                 <Icon sx={{width:"auto",height:"auto",display:"flex"}}>
                                     <Image src='/assets/icons/chat-icon-user.svg' alt='chat-icon' width={20} height={20} />
                                </Icon>
                                } 
                                 onClick={() => alert("Clicked!")}>
                                    Chat
                                </CustomButtonRoundedWithIcon>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>

                {/* right sec  */}

                <Grid size={{xs: 12, xl: 7 ,md:6}}>
                    <Box className="profileRight">

                        <Grid container rowSpacing={1.25}>
                            <Grid size={{ xs: 12 }}>
                                <Box sx={{ mb: 2 }}>
                                    <Stack direction="row" spacing={0.5} alignItems="center">
                                        <Typography variant='h3' className='profile_rightSec_common_header_text'>Alex Chen ,23</Typography>
                                        <Icon sx={{ width: "auto", height: "auto", display: "flex" }}>
                                            <Image src="/assets/icons/verified-greenTick-profile.svg" alt="verified icon" width={16} height={16} />
                                        </Icon>
                                    </Stack>
                                    <Typography variant='caption' className='profile_rightSec_common_header_subtext'>Angel Investor</Typography>
                                </Box>
                                <List disablePadding className="banner_list_company">
                                    <ListItem disablePadding className='profile_rightSec_common_header_subtext'>GreenTech Innovations</ListItem>
                                    <ListItem disablePadding className='profile_rightSec_common_header_subtext'>Seeking Series A</ListItem>
                                </List>
                                <Stack className='profile_rightSec_address_cont' direction="row" spacing={1} alignItems="center">
                                    <Icon sx={{ width: "auto", height: "auto", display: "flex" }}>
                                        <Image src="/assets/icons/location-icon-profile-right.svg" alt="verified icon" width={16} height={16} />
                                    </Icon>
                                    <List disablePadding className="banner_list_address">
                                        <ListItem disablePadding className='profile_rightSec_common_header_subtext'>San Francisco, USA </ListItem>
                                        <ListItem disablePadding className='profile_rightSec_common_header_subtext'>Open to Global Deals</ListItem>
                                    </List>
                                </Stack>
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <Typography variant='h3' className='profile_rightSec_common_header_text' sx={{ mb: 1.5 }}>About</Typography>
                                <List disablePadding className='profile_rightSec_about_li_cont'>
                                    {profileRightSecAboutData.map((item, index) => {
                                        const words = item.textContent.trim().split(" ");
                                        const firstWord = words.shift();
                                        const restOfContent = words.join(" ");
                                        return (
                                            <ListItem key={index} className='profile_rightSec_about_li_item' disablePadding alignItems='flex-start' sx={{ fontSize: 12, color: common.color6D9DC5 }} >
                                                <Typography
                                                    variant='caption'
                                                    fontSize={12}
                                                    fontWeight={600}
                                                    mr={"6px"}
                                                >
                                                    {index + 1}.
                                                </Typography>
                                                <Typography
                                                    variant='body1'
                                                    fontSize={12}
                                                    fontWeight={400}
                                                >
                                                    <Typography
                                                        variant='caption'
                                                        fontWeight={600}
                                                    >
                                                        {firstWord}
                                                    </Typography>
                                                    {" "}
                                                    {restOfContent}

                                                </Typography>
                                            </ListItem>
                                        );
                                    })}
                                </List>


                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <Typography variant='h3' className='profile_rightSec_common_header_text' sx={{ mb: 1.5 }}>Key Data</Typography>
                                <InvestorProfileTable items={demoKeyDataRows} />

                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <Typography variant='h3' className='profile_rightSec_common_header_text' sx={{ mb: 1.5 }}>Documents</Typography>
                                <ProfileDocumentsDisplay
                                    documents={demoDocuments}
                                    emptyMessage="No documents added yet."
                                />

                            </Grid>

                        </Grid>
                    </Box>
                </Grid>

            </Grid>

        </UserDetailStyled>
    )
}

export default UserDetail
