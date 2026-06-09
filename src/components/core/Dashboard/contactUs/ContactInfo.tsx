"use client"
import { Box,Typography, Icon, List, ListItem, Stack } from '@mui/material'
import React from 'react'
import Link from 'next/link';
import Image from 'next/image';
import {AboutContactUsInfoStyled} from '@/styledComponents/ContactUs/ContactUsInfoStyled'
const contactInfoData = [
    {
        contact: "+1012 3456 789",
        type: "phone",
        icon: "/assets/icons/phone-icon.svg"
    },
    {
        contact: "demo@gmail.com",
        type: "email",
        icon: "/assets/icons/email-icon.svg"
    },
    {
        contact: "132 Dartmouth Street Boston, Massachusetts 02156 United States",
        type: "location",
        icon: "/assets/icons/location-icon.svg"
    }
]

const socialIcons = [
    {
        href: "#",
        src: "/assets/icons/twitter-icon-contact.svg",
        alt: "twitter icon",
        width: 15,
        height: 12,
    },
    {
        href: "#",
        src: "/assets/icons/contact-svg.svg",
        alt: "icon",
        width: 15,
        height: 10,
    },
];

const getHref = (info: typeof contactInfoData[number]) => {
    switch (info.type) {
        case 'phone':
            return `tel:${info.contact.replace(/\s+/g, '')}`;
        case 'email':
            return `mailto:${info.contact}`;
        case 'location':
            return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(info.contact)}`;
        default:
            return "#";
    }
}




const ContactInfo = () => {
    return (
        <AboutContactUsInfoStyled>
            <Box className='contactus_leftsec_text_content'>
                <Typography variant='body1' className='contactus_leftsec_title'>
                    Contact Information
                </Typography>
                <Typography variant='caption' className='contactus_leftsec_subtitle'>
                    Say something to start a live chat!
                </Typography>
            </Box>


            <List className="contactus_leftsec_links_items_cont">
                {contactInfoData.map((info, index) => (
                    <ListItem
                        key={index}
                        disableGutters
                        disablePadding
                        className="contactus_leftsec_linkitem"
                    >
                        <Icon className="contactus_leftsec_linkitem_icon">
                            <Image
                                src={info.icon}
                                alt={`${info.type} icon`}
                                width={24}
                                height={24}
                            />
                        </Icon>
                        <Link
                            href={getHref(info)}
                            target={info.type === 'location' ? "_blank" : undefined}
                            rel={info.type === 'location' ? "noopener noreferrer" : undefined}
                            style={{
                                display: "flex",
                                textDecoration: "none",
                                color: "inherit",
                                flex: 1,
                            }}
                        >
                            {info.contact.replace(/,/g, ",\n")}
                        </Link>
                    </ListItem>
                ))}
            </List>




            <Stack
                className="contactus_leftsec_social_links_cont"
                direction="row"
                spacing={"23px"}
                justifyContent="center"
                alignItems="center"
            >
                {socialIcons.map((icon, index) => (
                    <Link
                        key={index}
                        href={icon.href}
                        className="contactus_leftsec_social_linkitem"
                    >
                        <Icon className="contactus_leftsec_social_icon_cont">
                            <Image
                                src={icon.src}
                                alt={icon.alt}
                                width={icon.width}
                                height={icon.height}
                            />
                        </Icon>
                    </Link>
                ))}
            </Stack>


            <Box className="contactus_leftsec_bg_decorative_circles">
                <Image src="/assets/icons/contactus-left-bg-circles.svg" alt='decorative circles' fill />
            </Box>
        </AboutContactUsInfoStyled>
    )
}

export default ContactInfo


