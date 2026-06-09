"use client";

import LandingHeader from "@/components/layout/Landingpage/LandingHeader/LandingHeader";
import { LandingPageStyled } from "@/styledComponents/LandingPage/LandingPageStyled";
import Banner from "./Banner";
import SolutionSection from "./SolutionSection";
import FeaturesSection from "./FeaturesSection";
import TimelineSec from "./TimelineSec";
import NewsletterSec from "./NewsletterSec";
import LandingFooter from "@/components/layout/Landingpage/LandingFooter/LandingFooter";
import { useEffect } from "react";
import Aos from "aos";
import "aos/dist/aos.css";

const LandingClient = () => {
  useEffect(function () {
    Aos.init({ duration: 1000, once: true });
  }, []);
  return (
    <LandingPageStyled>
      <LandingHeader />
      <Banner />
      <SolutionSection />
      <FeaturesSection />
      <TimelineSec />
      <NewsletterSec />
      <LandingFooter />
    </LandingPageStyled>
  );
};

export default LandingClient;
