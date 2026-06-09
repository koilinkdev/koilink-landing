import React from 'react'
import DashboardWrapper from '@/components/core/Dashboard/DashboardWrapper'
import NotificationClient from '@/components/core/Dashboard/Notification/NotificationClient'
const page = () => {
    return (
        <DashboardWrapper>
            <NotificationClient />
        </DashboardWrapper>
    )
}

export default page
