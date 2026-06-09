"use client";

import * as React from "react";
import SearchIcon from "@mui/icons-material/Search";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import {
    Avatar,
    Button,
    Box,
    Chip,
    CircularProgress,
    DialogActions,
    DialogContent,
    Divider,
    FormControl,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import FilterButton from "@/components/ui/Dashboard/FilterButton";
import DashboardModal from "@/components/ui/Dashboard/DashboardModal";
import { CustomButtonRounded } from "@/components/ui/Dashboard/CustomButtonRounded";
import { StyledLabel } from "@/components/ui/Dashboard/CustomSelectTagProfile";
import { CustomButtonTransparent } from "@/components/ui/Dashboard/CustomButtonTransparent";
import {
    AllMatchesTableSecStyled,
    MatchedCandidateFilterFormStyled,
} from "@/styledComponents/AllMatches/AllMatchesTableSecStyled";
import type { DashboardMatchRow } from "./allMatches.types";
import MatchProfileDetailModal from "./MatchProfileDetailModal";
import {
    DEFAULT_SEARCH_FILTERS,
    type SearchFilters,
    type SearchFundingStage,
    type SearchFundingStatus,
    type SearchInvestorType,
    type SearchRoleType,
} from "@/lib/search-api";
import { getNameInitials } from "./matchProfileDetail.helpers";

type Data = DashboardMatchRow;
type Order = "asc" | "desc";
type MatchSortBy = "bestMatch" | "newest" | "name" | "investmentSize";

type AllMatchesTableSecProps = {
    rows: Data[];
    isLoading?: boolean;
    feedbackMessage?: string | null;
    // Lifted filter state — parent owns the filters and calls the API
    appliedFilters?: SearchFilters;
    onFiltersApply?: (filters: SearchFilters) => void;
};

interface HeadCell {
    id: "id" | "name" | "companyName" | "address" | "userType";
    label: string;
    numeric: boolean;
}

const headCells: readonly HeadCell[] = [
    { id: "id", numeric: false, label: "ID" },
    { id: "name", numeric: false, label: "Name" },
    { id: "companyName", numeric: false, label: "Company / Firm" },
    { id: "address", numeric: false, label: "Location" },
    { id: "userType", numeric: false, label: "Type" },
];

const ROLE_TYPE_OPTIONS: { value: SearchRoleType; label: string }[] = [
    { value: "investor", label: "Investor" },
    { value: "company", label: "Company" },
    { value: "broker", label: "Broker" },
];

const INVESTOR_TYPE_OPTIONS: { value: SearchInvestorType; label: string }[] = [
    { value: "angel", label: "Angel" },
    { value: "venture_capital", label: "Venture Capital" },
    { value: "individual", label: "Individual" },
    { value: "institutional", label: "Institutional" },
    { value: "private_equity", label: "Private Equity" },
];

const INDUSTRY_OPTIONS: string[] = [
    "Technology",
    "Healthcare",
    "Finance",
    "Real Estate",
    "Energy",
    "Retail",
    "Manufacturing",
    "Education",
    "Media",
    "Transportation",
    "Food & Beverage",
    "SaaS",
];

const FUNDING_STAGE_OPTIONS: { value: SearchFundingStage; label: string }[] = [
    { value: "idea", label: "Idea" },
    { value: "mvp", label: "MVP" },
    { value: "pre_seed", label: "Pre-Seed" },
    { value: "seed", label: "Seed" },
    { value: "pre_revenue", label: "Pre-Revenue" },
    { value: "series_a", label: "Series A" },
    { value: "series_b", label: "Series B" },
    { value: "series_c", label: "Series C" },
    { value: "revenue_generating", label: "Revenue Generating" },
    { value: "growth", label: "Growth" },
    { value: "mature", label: "Mature" },
    { value: "ipo", label: "IPO" },
];

const FUNDING_STATUS_OPTIONS: { value: SearchFundingStatus; label: string }[] = [
    { value: "seeking", label: "Seeking Funding" },
    { value: "funded", label: "Funded" },
    { value: "not_seeking", label: "Not Seeking" },
];

const SORT_OPTIONS: { value: MatchSortBy; label: string }[] = [
    { value: "bestMatch", label: "Best Match" },
    { value: "newest", label: "Newest" },
    { value: "name", label: "Name" },
    { value: "investmentSize", label: "Investment Size" },
];

const normalizeText = (value?: string | null) => (value ?? "").trim().toLowerCase();

const compareText = (left?: string | null, right?: string | null) =>
    normalizeText(left).localeCompare(normalizeText(right));

const compareNumberDesc = (left?: number | null, right?: number | null) => {
    const safeLeft = typeof left === "number" ? left : Number.NEGATIVE_INFINITY;
    const safeRight = typeof right === "number" ? right : Number.NEGATIVE_INFINITY;
    return safeRight - safeLeft;
};

const compareDateDesc = (left?: string | null, right?: string | null) => {
    const safeLeft = left ? new Date(left).getTime() : Number.NEGATIVE_INFINITY;
    const safeRight = right ? new Date(right).getTime() : Number.NEGATIVE_INFINITY;
    return safeRight - safeLeft;
};

const matchesSearch = (row: Data, query: string) => {
    if (!query) return true;

    const haystack = [
        row.id,
        row.name,
        row.companyName,
        row.address,
        row.userType,
        row.industry,
        row.stage,
        row.city,
        row.state,
        row.country,
    ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

    return haystack.includes(query);
};

const getPresetSortedRows = (rows: Data[], sortBy: MatchSortBy) => {
    const nextRows = [...rows];

    nextRows.sort((left, right) => {
        switch (sortBy) {
            case "bestMatch": {
                const scoreComparison = compareNumberDesc(left.matchScore, right.matchScore);
                if (scoreComparison !== 0) return scoreComparison;
                const matchedAtComparison = compareDateDesc(left.matchedAt, right.matchedAt);
                if (matchedAtComparison !== 0) return matchedAtComparison;
                return compareText(left.name, right.name);
            }
            case "newest": {
                const matchedAtComparison = compareDateDesc(left.matchedAt, right.matchedAt);
                return matchedAtComparison !== 0
                    ? matchedAtComparison
                    : compareText(left.name, right.name);
            }
            case "investmentSize": {
                const investmentComparison = compareNumberDesc(left.investment, right.investment);
                return investmentComparison !== 0
                    ? investmentComparison
                    : compareText(left.name, right.name);
            }
            case "name":
            default:
                return compareText(left.name, right.name);
        }
    });

    return nextRows;
};

const getColumnValue = (row: Data, key: HeadCell["id"]) => {
    switch (key) {
        case "id": return row.id;
        case "name": return row.name;
        case "companyName": return row.companyName;
        case "address": return row.address;
        case "userType": return row.userType;
    }
};

const EnhancedTableHead = ({
    order,
    orderBy,
    isColumnSortActive,
    onRequestSort,
}: {
    order: Order;
    orderBy: HeadCell["id"];
    isColumnSortActive: boolean;
    onRequestSort: (event: React.MouseEvent<unknown>, property: HeadCell["id"]) => void;
}) => {
    const createSortHandler = (property: HeadCell["id"]) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        className={`column_${headCell.id}`}
                        align={headCell.numeric ? "right" : "left"}
                        sortDirection={isColumnSortActive && orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={isColumnSortActive && orderBy === headCell.id}
                            direction={isColumnSortActive && orderBy === headCell.id ? order : "asc"}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {isColumnSortActive && orderBy === headCell.id && (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === "desc" ? "sorted descending" : "sorted ascending"}
                                </Box>
                            )}
                        </TableSortLabel>
                    </TableCell>
                ))}
                <TableCell align="right" className="action_column">Action</TableCell>
            </TableRow>
        </TableHead>
    );
};

function toggleArrayItem<T extends string>(items: T[], item: T): T[] {
    return items.includes(item) ? items.filter((value) => value !== item) : [...items, item];
}

const AllMatchesTableSec = ({
    rows,
    isLoading = false,
    feedbackMessage = null,
    appliedFilters: externalAppliedFilters,
    onFiltersApply,
}: AllMatchesTableSecProps) => {
    const [order, setOrder] = React.useState<Order>("asc");
    const [orderBy, setOrderBy] = React.useState<HeadCell["id"]>("name");
    const [isColumnSortActive, setIsColumnSortActive] = React.useState(false);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [queryInput, setQueryInput] = React.useState("");
    const [debouncedQuery, setDebouncedQuery] = React.useState("");
    const [filterOpen, setFilterOpen] = React.useState(false);
    const [sortBy, setSortBy] = React.useState<MatchSortBy>("bestMatch");
    const [selectedMatch, setSelectedMatch] = React.useState<Data | null>(null);

    // Draft filters are local to the modal UI; applied filters come from parent
    const [draftFilters, setDraftFilters] = React.useState<SearchFilters>(
        externalAppliedFilters ?? { ...DEFAULT_SEARCH_FILTERS },
    );

    // Keep draft in sync when parent resets
    React.useEffect(() => {
        if (externalAppliedFilters) {
            setDraftFilters(externalAppliedFilters);
        }
    }, [externalAppliedFilters]);

    React.useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            setDebouncedQuery(queryInput.trim().toLowerCase());
        }, 400);
        return () => window.clearTimeout(timeoutId);
    }, [queryInput]);

    React.useEffect(() => {
        setPage(0);
    }, [rows, debouncedQuery, sortBy, rowsPerPage]);

    // Count active filters from the server-applied filters
    const activeFilterCount = React.useMemo(() => {
        const filters = externalAppliedFilters ?? DEFAULT_SEARCH_FILTERS;
        let count = 0;
        if ((filters.roleTypes?.length ?? 0) > 0) count++;
        if (filters.verifiedOnly) count++;
        if ((filters.investorTypes?.length ?? 0) > 0) count++;
        if ((filters.industries?.length ?? 0) > 0) count++;
        if ((filters.fundingStages?.length ?? 0) > 0) count++;
        if ((filters.fundingStatuses?.length ?? 0) > 0) count++;
        if (filters.country || filters.state || filters.city) count++;
        return count;
    }, [externalAppliedFilters]);

    // Client-side: text search only (filters are server-side)
    const textFilteredRows = React.useMemo(() => {
        if (!debouncedQuery) return rows;
        return rows.filter((row) => matchesSearch(row, debouncedQuery));
    }, [rows, debouncedQuery]);

    const sortedRows = React.useMemo(() => {
        const presetSortedRows = getPresetSortedRows(textFilteredRows, sortBy);

        if (!isColumnSortActive) return presetSortedRows;

        return [...presetSortedRows].sort((left, right) => {
            const comparison = compareText(
                getColumnValue(left, orderBy),
                getColumnValue(right, orderBy),
            );
            return order === "asc" ? comparison : -comparison;
        });
    }, [textFilteredRows, sortBy, isColumnSortActive, order, orderBy]);

    const paginatedRows = React.useMemo(() => {
        const startIndex = page * rowsPerPage;
        return sortedRows.slice(startIndex, startIndex + rowsPerPage);
    }, [page, rowsPerPage, sortedRows]);

    const handleRequestSort = (_event: React.MouseEvent<unknown>, property: HeadCell["id"]) => {
        const isAsc = isColumnSortActive && orderBy === property && order === "asc";
        setIsColumnSortActive(true);
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const handleChangePage = (_event: unknown, newPage: number) => setPage(newPage);

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
    };

    const handleApplyFilters = () => {
        onFiltersApply?.(draftFilters);
        setFilterOpen(false);
    };

    const handleResetFilters = () => {
        const reset = { ...DEFAULT_SEARCH_FILTERS };
        setDraftFilters(reset);
        onFiltersApply?.(reset);
        setFilterOpen(false);
    };

    const handleCloseModal = () => {
        setDraftFilters(externalAppliedFilters ?? { ...DEFAULT_SEARCH_FILTERS });
        setFilterOpen(false);
    };

    const handleOpenProfile = (row: Data) => {
        setSelectedMatch(row);
    };

    const handleCloseProfile = () => {
        setSelectedMatch(null);
    };

    const copyToClipboard = (text: string) => {
        void navigator.clipboard.writeText(text);
    };

    const emptyStateMessage =
        rows.length === 0
            ? feedbackMessage || "No matched candidates available right now."
            : "No matched candidates found for the current search.";

    const isEmptyError = rows.length === 0 && feedbackMessage?.toLowerCase().includes("failed");

    return (
        <AllMatchesTableSecStyled>
            <Stack
                direction="row"
                justifyContent="flex-end"
                alignItems="center"
                width="100%"
                className="table_inp_btn_cont"
                flexWrap="wrap"
            >
                <Box className="searchbar_wrapper">
                    <TextField
                        size="small"
                        fullWidth
                        placeholder="Search by name"
                        value={queryInput}
                        onChange={(event) => setQueryInput(event.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

                <FormControl size="small" className="sort_select_wrapper">
                    <InputLabel>sort by</InputLabel>
                    <Select
                        value={sortBy}
                        label="sort by"
                        onChange={(event) => {
                            setSortBy(event.target.value as MatchSortBy);
                            setIsColumnSortActive(false);
                        }}
                    >
                        {SORT_OPTIONS.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Box className="filter_button_wrapper">
                    <FilterButton
                        onClick={() => {
                            setDraftFilters(externalAppliedFilters ?? { ...DEFAULT_SEARCH_FILTERS });
                            setFilterOpen(true);
                        }}
                    />
                    {activeFilterCount > 0 && (
                        <Box className="active_filter_badge">
                            {activeFilterCount}
                        </Box>
                    )}
                </Box>
            </Stack>

            <Box className="table_shell">
                <Paper className="table_paper">
                    <TableContainer className="table_container">
                        <Table aria-labelledby="tableTitle" stickyHeader className="matches_table">
                            <EnhancedTableHead
                                order={order}
                                orderBy={orderBy}
                                isColumnSortActive={isColumnSortActive}
                                onRequestSort={handleRequestSort}
                            />
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={headCells.length + 1} align="center" className="loading_cell">
                                            <CircularProgress size={28} />
                                        </TableCell>
                                    </TableRow>
                                ) : paginatedRows.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={headCells.length + 1}>
                                            <Typography className={`empty_state_text${isEmptyError ? " is_error" : ""}`}>
                                                {emptyStateMessage}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    paginatedRows.map((row) => (
                                        <TableRow hover key={row.id} className="match_table_row">
                                            <TableCell className="column_id">
                                                <Typography variant="caption" className="match_id_text">
                                                    {row.id}
                                                </Typography>
                                            </TableCell>
                                            <TableCell className="column_name">
                                                <Box className="candidate_info">
                                                    <Avatar
                                                        src={row.avatar}
                                                        className={`candidate_avatar${!row.avatar ? " fallback_avatar" : ""}`}
                                                    >
                                                        {!row.avatar && getNameInitials(row.name)}
                                                    </Avatar>
                                                    {row.name}
                                                </Box>
                                            </TableCell>
                                            <TableCell className="column_companyName">{row.companyName}</TableCell>
                                            <TableCell className="column_address">
                                                <Box className="location_info">
                                                    {row.address}
                                                    <Tooltip title="Copy location">
                                                        <IconButton
                                                            onClick={() => copyToClipboard(row.address)}
                                                            size="small"
                                                            className="copy-icon"
                                                            disableRipple
                                                        >
                                                            <ContentCopyIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </TableCell>
                                            <TableCell className="column_userType">{row.userType}</TableCell>
                                            <TableCell align="right" className="action_column">
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    className="show_more_button"
                                                    onClick={() => handleOpenProfile(row)}
                                                >
                                                    Show More
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <TablePagination
                        rowsPerPageOptions={[10, 20, 50]}
                        component="div"
                        count={sortedRows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            </Box>

            {filterOpen && (
                <DashboardModal
                    open={filterOpen}
                    title="Matched Candidate Filters"
                    onClose={handleCloseModal}
                    maxWidth="sm"
                >
                    <MatchedCandidateFilterFormStyled>
                        <DialogContent className="matched_filter_modal_content">
                            <Stack spacing={2.5}>
                                <Box>
                                    <StyledLabel>Profile type</StyledLabel>
                                    <Stack direction="row" flexWrap="wrap" className="filter_chip_row">
                                        {ROLE_TYPE_OPTIONS.map(({ value, label }) => (
                                            <Chip
                                                key={value}
                                                label={label}
                                                clickable
                                                size="small"
                                                color={(draftFilters.roleTypes ?? []).includes(value) ? "primary" : "default"}
                                                variant={(draftFilters.roleTypes ?? []).includes(value) ? "filled" : "outlined"}
                                                onClick={() =>
                                                    setDraftFilters((previous) => ({
                                                        ...previous,
                                                        roleTypes: toggleArrayItem(previous.roleTypes ?? [], value),
                                                    }))
                                                }
                                            />
                                        ))}
                                    </Stack>
                                    <Typography variant="caption" className="filter_helper_text">
                                        Leave unselected to show every matched profile type.
                                    </Typography>
                                </Box>

                                <Divider />

                                <Stack direction="row" alignItems="center" justifyContent="space-between">
                                    <Box>
                                        <Typography variant="body2" className="filter_switch_title">
                                            Verified profiles only
                                        </Typography>
                                        <Typography variant="caption" className="filter_helper_text">
                                            Show only verified users from your current matches.
                                        </Typography>
                                    </Box>
                                    <Switch
                                        checked={draftFilters.verifiedOnly ?? false}
                                        onChange={(event) =>
                                            setDraftFilters((previous) => ({
                                                ...previous,
                                                verifiedOnly: event.target.checked,
                                            }))
                                        }
                                        color="primary"
                                    />
                                </Stack>

                                <Divider />

                                <Box>
                                    <StyledLabel>Investor type</StyledLabel>
                                    <Stack direction="row" flexWrap="wrap" className="filter_chip_row">
                                        {INVESTOR_TYPE_OPTIONS.map(({ value, label }) => (
                                            <Chip
                                                key={value}
                                                label={label}
                                                clickable
                                                size="small"
                                                color={(draftFilters.investorTypes ?? []).includes(value) ? "primary" : "default"}
                                                variant={(draftFilters.investorTypes ?? []).includes(value) ? "filled" : "outlined"}
                                                onClick={() =>
                                                    setDraftFilters((previous) => ({
                                                        ...previous,
                                                        investorTypes: toggleArrayItem(previous.investorTypes ?? [], value),
                                                    }))
                                                }
                                            />
                                        ))}
                                    </Stack>
                                </Box>

                                <Divider />

                                <Box>
                                    <StyledLabel>Industry</StyledLabel>
                                    <Stack direction="row" flexWrap="wrap" className="filter_chip_row">
                                        {INDUSTRY_OPTIONS.map((industry) => (
                                            <Chip
                                                key={industry}
                                                label={industry}
                                                clickable
                                                size="small"
                                                color={(draftFilters.industries ?? []).includes(industry) ? "primary" : "default"}
                                                variant={(draftFilters.industries ?? []).includes(industry) ? "filled" : "outlined"}
                                                onClick={() =>
                                                    setDraftFilters((previous) => ({
                                                        ...previous,
                                                        industries: toggleArrayItem(previous.industries ?? [], industry),
                                                    }))
                                                }
                                            />
                                        ))}
                                    </Stack>
                                </Box>

                                <Divider />

                                <Box>
                                    <StyledLabel>Funding / company stage</StyledLabel>
                                    <Stack direction="row" flexWrap="wrap" className="filter_chip_row">
                                        {FUNDING_STAGE_OPTIONS.map(({ value, label }) => (
                                            <Chip
                                                key={value}
                                                label={label}
                                                clickable
                                                size="small"
                                                color={(draftFilters.fundingStages ?? []).includes(value) ? "primary" : "default"}
                                                variant={(draftFilters.fundingStages ?? []).includes(value) ? "filled" : "outlined"}
                                                onClick={() =>
                                                    setDraftFilters((previous) => ({
                                                        ...previous,
                                                        fundingStages: toggleArrayItem(previous.fundingStages ?? [], value),
                                                    }))
                                                }
                                            />
                                        ))}
                                    </Stack>
                                </Box>

                                <Divider />

                                <Box>
                                    <StyledLabel>Funding status</StyledLabel>
                                    <Stack direction="row" flexWrap="wrap" className="filter_chip_row">
                                        {FUNDING_STATUS_OPTIONS.map(({ value, label }) => (
                                            <Chip
                                                key={value}
                                                label={label}
                                                clickable
                                                size="small"
                                                color={(draftFilters.fundingStatuses ?? []).includes(value) ? "primary" : "default"}
                                                variant={(draftFilters.fundingStatuses ?? []).includes(value) ? "filled" : "outlined"}
                                                onClick={() =>
                                                    setDraftFilters((previous) => ({
                                                        ...previous,
                                                        fundingStatuses: toggleArrayItem(previous.fundingStatuses ?? [], value),
                                                    }))
                                                }
                                            />
                                        ))}
                                    </Stack>
                                </Box>

                                <Divider />

                                <Box>
                                    <StyledLabel>Location</StyledLabel>
                                    <Grid container spacing={1} className="location_grid">
                                        <Grid size={{ xs: 12, sm: 4 }}>
                                            <TextField
                                                size="small"
                                                fullWidth
                                                label="Country"
                                                value={draftFilters.country ?? ""}
                                                onChange={(event) =>
                                                    setDraftFilters((previous) => ({
                                                        ...previous,
                                                        country: event.target.value || undefined,
                                                    }))
                                                }
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 4 }}>
                                            <TextField
                                                size="small"
                                                fullWidth
                                                label="State"
                                                value={draftFilters.state ?? ""}
                                                onChange={(event) =>
                                                    setDraftFilters((previous) => ({
                                                        ...previous,
                                                        state: event.target.value || undefined,
                                                    }))
                                                }
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 4 }}>
                                            <TextField
                                                size="small"
                                                fullWidth
                                                label="City"
                                                value={draftFilters.city ?? ""}
                                                onChange={(event) =>
                                                    setDraftFilters((previous) => ({
                                                        ...previous,
                                                        city: event.target.value || undefined,
                                                    }))
                                                }
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Stack>
                        </DialogContent>

                        <DialogActions className="matched_filter_modal_actions">
                            <Stack direction="row" spacing={2} width="100%">
                                <CustomButtonTransparent fullWidth onClick={handleResetFilters}>
                                    Reset All
                                </CustomButtonTransparent>
                                <CustomButtonRounded
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={handleApplyFilters}
                                >
                                    Apply Filters
                                    {activeFilterCount > 0 && ` (${activeFilterCount})`}
                                </CustomButtonRounded>
                            </Stack>
                        </DialogActions>
                    </MatchedCandidateFilterFormStyled>
                </DashboardModal>
            )}

            {selectedMatch && (
                <MatchProfileDetailModal
                    open={Boolean(selectedMatch)}
                    row={selectedMatch}
                    onClose={handleCloseProfile}
                />
            )}
        </AllMatchesTableSecStyled>
    );
};

export default AllMatchesTableSec;
