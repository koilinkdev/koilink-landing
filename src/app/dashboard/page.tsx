import React from 'react'
import DashboardWrapper from '@/components/core/Dashboard/DashboardWrapper'
import DashboardMatchesOverview from '@/components/core/Dashboard/AllMatches/DashboardMatchesOverview'

const page = () => {
    return (
        <DashboardWrapper>
            <DashboardMatchesOverview />
        </DashboardWrapper>
    )

}

export default page
