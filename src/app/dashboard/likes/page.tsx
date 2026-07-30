import React from "react"
import DashboardWrapper from "@/components/core/Dashboard/DashboardWrapper"
import LikesReceivedClient from "@/components/core/Dashboard/LikesReceived/LikesReceivedClient"

const page = () => {
  return (
    <DashboardWrapper>
      <LikesReceivedClient />
    </DashboardWrapper>
  )
}

export default page
