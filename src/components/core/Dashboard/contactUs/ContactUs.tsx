"use client"
import React from 'react'
import ContactInfo from '@/components/core/Dashboard/contactUs/ContactInfo'
import ContactusFormSec from '@/components/core/Dashboard/contactUs/ContactusFormSec'
import { Box, styled,Grid } from '@mui/material'


const AboutContactUsStyled = styled(Box)`
padding:24px 14px auto 24px;

`

const ContactUs = () => {
  return (
    <AboutContactUsStyled>
      <Grid container spacing="28px">

        <Grid size={{xs:12,md:5.5}}>
           <ContactInfo/>
        </Grid>

        <Grid size={{xs:12,md:6.5}}>
             <ContactusFormSec/>
        </Grid>

      </Grid>

    </AboutContactUsStyled>
  )
}

export default ContactUs
