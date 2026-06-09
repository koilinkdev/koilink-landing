import { Box, styled } from "@mui/material";

export const SectionTitleStyled = styled(Box)`
    position: relative;
    max-width: 860px;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 40px;
    @media (max-width: 899px) {
        margin-bottom: 30px;
    }

    h2{
        @media (max-width: 599px) {
            br{
                display: none;
            }
        }
    }
`