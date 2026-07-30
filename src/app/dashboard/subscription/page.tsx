import React from "react"
import DashboardWrapper from "@/components/core/Dashboard/DashboardWrapper"
import SubscriptionClient from "@/components/core/Dashboard/Subscription/SubscriptionClient"

const page = () => {
  return (
    <DashboardWrapper>
      <SubscriptionClient />
    </DashboardWrapper>
  )
}

export default page
