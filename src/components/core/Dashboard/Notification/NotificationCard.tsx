"use client"
import React from 'react'
import { Box, Avatar, Typography} from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'
import {NotificationCardStyled} from '@/styledComponents/Notification/NotificationCardStyled'

interface NotificationCardProps {
    iconColor: string
    title: string
    description: string
    time: string
    badge?: number | string
    src?: string
    alt?: string
    href?: string 
   
}

const NotificationCard: React.FC<NotificationCardProps> = ({
    iconColor,
    title,
    description,
    time,
    badge,
    src,
    alt,
    href,
}) => {
    const CardContent = (
        <NotificationCardStyled>
            <Avatar
                sx={{
                    bgcolor: iconColor,
                    width: 48,
                    height: 48,
                    flexShrink: 0,
                }}
            >
                {src ? (
                    <Image src={src} alt={alt || 'icon'} width={24} height={24} />
                ) : (
                    null
                )}
            </Avatar>

            <Box className="NotificationCard_RightSec">
                <Box className="notificationCard_title_time_cont">
                    <Typography variant='h6' className='notificationCard_title'>
                        {title}
                    </Typography>
                    <Typography variant='body2' className='notificationCard_time'>
                        {time}
                    </Typography>
                </Box>

                <Box className="description_badge_cont">
                    <Typography variant='body1' className='notificationCard_description'>
                        {description}
                    </Typography>
                    {badge && (
                        <Box className='notificationCard_badge_cont'>
                            <Typography variant='caption'>{badge}</Typography>
                        </Box>
                    )}
                </Box>
            </Box>
        </NotificationCardStyled>
    )

   
    if (href) {
        return (
            <Link href={href} passHref style={{ textDecoration: 'none' }}>
                {CardContent}
            </Link>
        )
    }

    
    return CardContent
}

export default NotificationCard