"use client";

import { SolutionSectionStyled } from "@/styledComponents/LandingPage/SolutionSectionStyled";
import SectionTitle from "./SectionTitle";
import {
  Box,
  Chip,
  Container,
  Grid,
  Icon,
  Link,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import Image from "next/image";
import CustomOutlinedButton from "@/components/ui/LandingPage/CustomOutlinedButton/CustomOutlinedButton";

const solutionSectionData = [
  {
    sectionHeadingText: "Experience",
    sectionHeadingIcon: "/assets/images/s1.svg",
    description:
      "What is better than a work environment that cares for its employees? Our Employee Experience is an innovative solution that gives your employees a voice. Make them feel heard by analyzing their thoughts and feedback to improve your business’s work environment, ensure talent retention and encourage new hires.",
    sectionImage: "/assets/images/solution-section-1.png",
    chipLabels: [
      "Employee Onboarding",
      "Employee Engagement",
      "Employee Well-being",
      "Employee Happiness",
      "Employee Exit",
      "360° Feedback",
    ],
    buttonDetails: [
      {
        buttonLabel: "Explore Employee Experience",
        buttonPath: "#url",
      },
    ],
  },
  {
    sectionHeadingText: "Assessments",
    sectionHeadingIcon: "/assets/images/s2.svg",
    description:
      "Our assessment solutions focus on two major aspects, pre-assessments and post-assessments. With Koilink Assessments, you can measure the critical skills of current and potential employees to determine the best candidate for positions and pinpoint employees who are ready for promotions.",
    sectionImage: "/assets/images/solution-section-2.png",
    chipLabels: ["Competency", " Engagement", "Psychometric - Thomas"],
    buttonDetails: [
      {
        buttonLabel: "Explore Koilink Experience",
        buttonPath: "#url",
      },
    ],
  },
  {
    sectionHeadingText: "Elevate",
    sectionHeadingIcon: "/assets/images/s3.svg",
    description:
      "How can you empower your talent strategy? Koilink Elevate is a smart, automated online system that provides in-depth analytics of your organization’s data. By leveraging data-driven insights, it enhances talent management, strengthens team dynamics, and drives employee development, creating lasting impact throughout your organization.",
    sectionImage: "/assets/images/solution-section-3.png",
    chipLabels: [
      "Employee Onboarding",
      " Employee Engagement",
      "Employee Well-being",
      "Employee Happiness",
      "Employee Exit",
      "360° Feedback",
    ],
    buttonDetails: [
      {
        buttonLabel: "Explore Koilink Elevate",
        buttonPath: "#url",
      },
    ],
  },
];

const ChipStyled = styled(Chip)`
  border: 1px solid rgba(11, 30, 67, 0.101961);
  border-radius: 80px;
  /* background-color: rgb(11, 30, 67, 10.2%); */
  background-color: transparent;
  .MuiChip-label {
    padding: 8px 24px;
    font-weight: 500;
    font-size: 14px;
    @media (max-width: 599px) {
      font-size: 12px;
      padding: 8px 18px;
    }
  }
`;
const SolutionSection = () => {
  return (
    <SolutionSectionStyled className="cmn_gap pt-0">
      <Container fixed maxWidth="xl">
        <SectionTitle
          subHeading="Solutions"
          heading={
            <>
              Introducing HR Solutions for <br /> the Modern Era
            </>
          }
        />
        <Box className="soltionSection">
          {solutionSectionData.map((item, index) => (
            <Box
              className={
                index % 2 === 0
                  ? "soltionSection_each"
                  : "soltionSection_each cmn_gap"
              }
              key={index}
            >
              <Grid
                container
                columnSpacing={13}
                rowSpacing={6}
                sx={{
                  flexDirection: {
                    xs: "column-reverse", // ≤600px
                    sm: index % 2 === 0 ? "row" : "row-reverse", // ≥600px
                  },
                }}
              >
                <Grid
                  size={{ xs: 12, md: 6 }}
                  data-aos={index % 2 === 0 ? "fade-right" : "fade-left"}
                >
                  <Box className="solContent">
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={2.5}
                      mb={3}
                    >
                      <Icon
                        sx={{ width: "auto", height: "auto", display: "flex" }}
                        className="solHeadIcon"
                      >
                        <Image
                          src={item.sectionHeadingIcon}
                          alt={`${item.sectionHeadingText} icon`}
                          width={56}
                          height={56}
                        />
                      </Icon>
                      <Typography variant="h2" className="solHeadTitle">
                        {item.sectionHeadingText}
                      </Typography>
                    </Stack>
                    <Typography variant="body1" mb={{ xs: 2.5, md: 4 }}>
                      {item.description}
                    </Typography>
                    <Box className="chipWrapper">
                      <Stack
                        direction="row"
                        alignItems="center"
                        flexWrap="wrap"
                        margin={"0 -4px -10px"}
                      >
                        {item.chipLabels.map((item, index) => (
                          <Box
                            className="chipClm"
                            padding={"0 4px"}
                            mb={1.2}
                            key={index}
                          >
                            <ChipStyled label={item} />
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                    <CustomOutlinedButton
                      component={Link}
                      href={item.buttonDetails[0].buttonPath}
                      color="primary"
                    >
                      {item.buttonDetails[0].buttonLabel}
                    </CustomOutlinedButton>
                  </Box>
                </Grid>
                <Grid
                  size={{ xs: 12, md: 6 }}
                  data-aos={index % 2 === 0 ? "fade-left" : "fade-right"}
                >
                  <Box className="solImg">
                    <Image
                      src={item.sectionImage}
                      alt={`${item.sectionHeadingText} image`}
                      fill
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          ))}
        </Box>
      </Container>
    </SolutionSectionStyled>
  );
};

export default SolutionSection;
