"use client";
import { TimelineSecStyled } from "@/styledComponents/LandingPage/TimelineSecStyled";
import {
  Box,
  Container,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SectionTitle from "./SectionTitle";
import CustomOutlinedButton from "@/components/ui/LandingPage/CustomOutlinedButton/CustomOutlinedButton";
import Link from "next/link";
import { useInView } from "react-intersection-observer";

const timelineData = [
  {
    content: {
      timelineSubHead: "Employee Onboarding",
      timelineHeading:
        "Create a positive first impression with a welcoming onboarding",
      timelineDescription:
        "From day one, ensure new hires are provided with the best impression and onboarding process with Employee Onboarding. Our data-driven approach streamlines hiring and reduces turnover with experiences that make new hires feel valued and supported. Access detailed surveys, tailored services, actionable insights, and more to invest in a strong foundation.",
      timlineButtonDetails: [
        {
          buttonLabel: "Explore Koilink Experience",
          buttonLink: "#url",
        },
      ],
    },
    timelineImage: "/assets/images/timeline-1.svg",
  },
  {
    content: {
      timelineSubHead: "Employee Onboarding",
      timelineHeading: "Empower business growth and engagement",
      timelineDescription:
        "Our unique services help drive motivation, performance, and engagement within your team with tailored recommendations. Using a comprehensive IMPACT model, designed to foster a more engaged and efficient workforce, businesses can ensure a better relationship between managers and the team.",
      timlineButtonDetails: [
        {
          buttonLabel: "Explore Koilink Experience",
          buttonLink: "#url",
        },
      ],
    },
    timelineImage: "/assets/images/timeline-2.svg",
  },
  {
    content: {
      timelineSubHead: "Employee Well-being",
      timelineHeading: "Take care of your business and its people",
      timelineDescription:
        "Zenithr’s Employee Well-being helps businesses foster a positive and healthy work environment that attracts, motivates, and cares for the team. With data-driven insights, detailed overviews, and well-being scores, you can build a workforce with positive physical and mental well-being.",
      timlineButtonDetails: [
        {
          buttonLabel: "Explore Koilink Experience",
          buttonLink: "#url",
        },
      ],
    },
    timelineImage: "/assets/images/timeline-3.svg",
  },

  {
    content: {
      timelineSubHead: "Employee Happiness",
      timelineHeading: "Cultivate a culture of joy",
      timelineDescription:
        "Build an environment of happiness with Employee Happiness with a comprehensive set of tools designed to empower your employees at every stage of their careers. With data-driven insights into employee satisfaction, business can measure happiness across various aspects and place strategic plans based on your unique needs.",
      timlineButtonDetails: [
        {
          buttonLabel: "Explore Koilink Experience",
          buttonLink: "#url",
        },
      ],
    },
    timelineImage: "/assets/images/timeline-4.svg",
  },

  {
    content: {
      timelineSubHead: "Employee Exit",
      timelineHeading: "Transform exits into future successes",
      timelineDescription:
        "With Employee Exit, you can turn departing employee feedback into actionable insights to improve your workplace. With customizable surveys, you can dive deeper into the business’s work conditions with a layered analysis to gain a holistic, comprehensive view of possible improvements.",
      timlineButtonDetails: [
        {
          buttonLabel: "Explore Koilink Experience",
          buttonLink: "#url",
        },
      ],
    },
    timelineImage: "/assets/images/timeline-5.svg",
  },
  {
    content: {
      timelineSubHead: "Employee Happiness",
      timelineHeading: "Cultivate a culture of joy",
      timelineDescription:
        "Build an environment of happiness with Employee Happiness with a comprehensive set of tools designed to empower your employees at every stage of their careers. With data-driven insights into employee satisfaction, business can measure happiness across various aspects and place strategic plans based on your unique needs.",
      timlineButtonDetails: [
        {
          buttonLabel: "Explore Koilink Experience",
          buttonLink: "#url",
        },
      ],
    },
    timelineImage: "/assets/images/timeline-6.svg",
  },

  {
    content: {
      timelineSubHead: "Employee Exit",
      timelineHeading: "Transform exits into future successes",
      timelineDescription:
        "With Employee Exit, you can turn departing employee feedback into actionable insights to improve your workplace. With customizable surveys, you can dive deeper into the business’s work conditions with a layered analysis to gain a holistic, comprehensive view of possible improvements.",
      timlineButtonDetails: [
        {
          buttonLabel: "Explore Koilink Experience",
          buttonLink: "#url",
        },
      ],
    },
    timelineImage: "/assets/images/timeline-7.svg",
  },
];

interface TimelineItemProps {
  timelineItem: (typeof timelineData)[number];
  index: number;
  isBelowMd: boolean;
}

const TimelineItem = ({ timelineItem, index, isBelowMd }: TimelineItemProps) => {
  const content = timelineItem.content;
  const image = timelineItem.timelineImage;
  const button = content?.timlineButtonDetails?.[0];

  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  if (!content || !button || !button.buttonLink) return null;

  return (
    <Box
      ref={ref}
      className={`timeline_each ${
        index % 2 !== 0 ? "timeline_opposite" : ""
      } fadeInUp ${inView ? "active" : ""}`}
    >
      <Grid
        container
        columnSpacing={{ xl: 13.5, md: 10, xs: 4 }}
        alignItems="center"
        flexDirection={index % 2 === 0 ? "row" : "row-reverse"}
      >
        <Grid
          size={{ xs: 12, md: 6 }}
          data-aos={
            isBelowMd
              ? "fade-left"
              : index % 2 === 0
              ? "fade-right"
              : "fade-left"
          }
        >
          <Box className="timeline_each_content">
            <Typography
              variant="body1"
              color="primary"
              fontSize={14}
              fontWeight={700}
              textTransform="uppercase"
              mb={1.5}
            >
              {content.timelineSubHead}
            </Typography>
            <Typography
              variant="h3"
              fontSize={{ xs: 20, md: 24, lg: 24 }}
              mb={2.5}
            >
              {content.timelineHeading}
            </Typography>
            <Typography
              variant="body1"
              fontSize={14}
              color="#747884"
              lineHeight={1.3}
              mb={{xs: 3, md: 4.5}}
            >
              {content.timelineDescription}
            </Typography>
            <CustomOutlinedButton
              color="primary"
              component={Link}
              href={button.buttonLink}
            >
              {button.buttonLabel}
            </CustomOutlinedButton>
          </Box>
        </Grid>
        <Grid
          size={{ xs: 12, md: 6 }}
          data-aos={
            isBelowMd
              ? "fade-left"
              : index % 2 === 0
              ? "fade-left"
              : "fade-right"
          }
        >
          <Box className="timeline_each_img">
            <Box
              component="img"
              src={image}
              alt={content.timelineHeading}
              sx={{ width: "100%", maxWidth: 347 }}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

const TimelineSec = () => {
  const theme = useTheme();
  const isBelowMd = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <TimelineSecStyled className="cmn_gap pt-0">
      <Container fixed maxWidth="xl">
        <SectionTitle
          subHeading="Company journey"
          heading={
            <>
              Say hello to a leading <br /> experience solution
            </>
          }
        />
        <Box className="timelineSec">
          {timelineData.map((timelineItem, index) => (
            <TimelineItem key={index} timelineItem={timelineItem} index={index} isBelowMd={isBelowMd} />
          ))}
        </Box>
      </Container>
    </TimelineSecStyled>
  );
};

export default TimelineSec;
