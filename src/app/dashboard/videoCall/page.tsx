import React from 'react'
import DashboardWrapper from '@/components/core/Dashboard/DashboardWrapper'
import VideoCallClient from '@/components/core/Dashboard/VideoCallClient/VideoCallClient'
const page = () => {
  return (
    <DashboardWrapper>
      <VideoCallClient/>
    </DashboardWrapper>
  )
}

export default page
