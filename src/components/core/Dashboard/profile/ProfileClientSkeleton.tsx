"use client"

import { Box, Grid, Skeleton, Stack } from "@mui/material"
import { common } from "@/theme/palette"
import { ProfileClientStyled } from "@/styledComponents/Profile/ProfileClientStyled"

const ProfileClientSkeleton = () => (
  <ProfileClientStyled>
    <Grid container spacing={2.5}>
      <Grid size={{ xs: 12, xl: 5, md: 6 }}>
        <Box className="profileLeft">
          <Box className="profileLeftImgWrap">
            <Skeleton
              variant="rectangular"
              animation="wave"
              sx={{ width: "100%", height: "100%", borderRadius: "24px", transform: "none" }}
            />
          </Box>

          <Stack direction="row" spacing={2.5} justifyContent="center" alignItems="center" marginBottom={2.5}>
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} variant="circular" animation="wave" width={24} height={24} />
            ))}
          </Stack>

          <Grid container spacing={1.2}>
            <Grid size={{ xs: 6 }}>
              <Skeleton variant="rounded" animation="wave" height={50} sx={{ borderRadius: "29px", transform: "none" }} />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Skeleton variant="rounded" animation="wave" height={50} sx={{ borderRadius: "29px", transform: "none" }} />
            </Grid>
          </Grid>
        </Box>
      </Grid>

      <Grid size={{ xs: 12, xl: 7, md: 6 }}>
        <Box className="profileRight">
          <Grid container rowSpacing={1.75}>
            <Grid size={{ xs: 12 }}>
              <Stack spacing={0.9}>
                <Skeleton variant="text" animation="wave" width="42%" height={38} />
                <Skeleton variant="text" animation="wave" width={120} height={26} />
                <Skeleton variant="text" animation="wave" width="46%" height={28} />
                <Skeleton variant="text" animation="wave" width="56%" height={28} />
              </Stack>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Skeleton variant="text" animation="wave" width={90} height={32} sx={{ mb: 1 }} />
              <Stack spacing={1}>
                {Array.from({ length: 2 }).map((_, index) => (
                  <Stack key={index} direction="row" spacing={1} alignItems="flex-start">
                    <Skeleton variant="text" animation="wave" width={14} height={24} />
                    <Skeleton variant="text" animation="wave" width="88%" height={24} />
                  </Stack>
                ))}
              </Stack>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Skeleton variant="text" animation="wave" width={115} height={32} sx={{ mb: 1 }} />
              <Box
                sx={{
                  border: `1px solid ${common.colorE8EBEC}`,
                  borderRadius: "16px",
                  overflow: "hidden",
                  backgroundColor: common.white,
                }}
              >
                <Grid container>
                  {["Field", "Investor", "Company"].map((item, index) => (
                    <Grid key={item} size={{ xs: 4 }}>
                      <Box
                        sx={{
                          p: "16px 20px",
                          borderRight: index < 2 ? `1px solid ${common.colorE8EBEC}` : "none",
                          borderBottom: `1px solid ${common.colorE8EBEC}`,
                        }}
                      >
                        <Skeleton variant="text" animation="wave" width={index === 0 ? 56 : 84} height={28} />
                      </Box>
                    </Grid>
                  ))}
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Grid key={`row-${index}`} size={{ xs: 4 }}>
                      <Box
                        sx={{
                          p: "16px 20px",
                          borderRight: index < 2 ? `1px solid ${common.colorE8EBEC}` : "none",
                        }}
                      >
                        <Skeleton variant="text" animation="wave" width="74%" height={26} />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Skeleton variant="text" animation="wave" width={118} height={32} sx={{ mb: 1 }} />
              <Stack spacing={1}>
                {Array.from({ length: 2 }).map((_, index) => (
                  <Box
                    key={`doc-${index}`}
                    sx={{
                      p: 1.5,
                      border: `1px solid ${common.colorE8EBEC}`,
                      borderRadius: "14px",
                      backgroundColor: common.white,
                    }}
                  >
                    <Stack direction="row" spacing={1.25} alignItems="center" justifyContent="space-between">
                      <Stack direction="row" spacing={1.25} alignItems="center" sx={{ minWidth: 0, flex: 1 }}>
                        <Skeleton variant="rounded" animation="wave" width={40} height={40} sx={{ borderRadius: "12px" }} />
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Skeleton variant="text" animation="wave" width="46%" height={28} />
                          <Skeleton variant="text" animation="wave" width="34%" height={22} />
                        </Box>
                      </Stack>
                      <Skeleton variant="rounded" animation="wave" width={24} height={24} sx={{ borderRadius: "8px" }} />
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  </ProfileClientStyled>
)

export default ProfileClientSkeleton
