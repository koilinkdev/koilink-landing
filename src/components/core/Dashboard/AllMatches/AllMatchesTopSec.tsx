"use client";
import React from "react";
import { Box, Icon, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { AboutAllMatchesTopSecStyled } from "@/styledComponents/AllMatches/AllMatchesTopSecStyled";
import { allMatchCardData } from "@/mockData/index"
import type { DashboardMatchCard } from "./allMatches.types";


const AllMatchesTopSec = ({ cards = allMatchCardData as DashboardMatchCard[] }: { cards?: DashboardMatchCard[] }) => {
  return (
    <AboutAllMatchesTopSecStyled>

      <Stack direction="row" className="allMatchCard_row">
        {cards?.map((card, index) => {
          const isFirst = index === 0;
          const isLast = index === cards.length - 1;

          const cardClass = isFirst
            ? "allMatchCard_col first_col"
            : isLast
              ? "allMatchCard_col last_col"
              : "allMatchCard_col";

          return (
            <Box className={cardClass} key={index}>
              <Stack
                direction="row"
                alignItems="center"
                spacing={3}
                className="matches_single_item"
              >
                <Icon className="icon_cont">
                  <Image
                    src={card.image?.src}
                    width={42}
                    height={42}
                    alt={card.image?.alt}
                    className="icon_cont_item"
                  />
                </Icon>

                <Box>
                  <Typography variant="body1" className="title_text">
                    {card.text}
                  </Typography>

                  <Typography variant="h2" className="value_text">
                    {card.subtext}
                  </Typography>

                  {card.thisMonthdata && (
                    <Stack className="graph_cont" direction="row" spacing={"4px"} justifyContent="center" alignItems="center">
                      <Icon className="arrow_icon"
                        sx={{ display: "flex", width: "auto", height: "auto", justifyContent: "center", alignItems: "center" }}>
                        <Image
                          src={card.thisMonthdata.icon?.src}
                          width={20}
                          height={20}
                          alt={card.thisMonthdata.icon?.alt || "arrow"}
                        />
                      </Icon>
                      <Typography variant="body1" className="text_content">
                        <Typography variant="caption" component="span" className="text_content_blue" >
                          {card.thisMonthdata.value}
                        </Typography>{" "}
                        {card.thisMonthdata.timePeriod}
                      </Typography>
                    </Stack>
                  )}
                </Box>
              </Stack>
            </Box>
          );
        })}
      </Stack>
    </AboutAllMatchesTopSecStyled>
  );
};

export default AllMatchesTopSec;
