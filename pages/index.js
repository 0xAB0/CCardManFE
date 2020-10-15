import Link from "next/link";
import { useQuery } from "react-query";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import Button from "@material-ui/core/Button";

import TimeSeriesLineGraph from "../components/TimeSeriesLineGraph";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(1),
  },
  controls: {
    "& > *": {
      marginBottom: theme.spacing(2),
    },
  },
}));

const fetchStatementList = async () => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/statement/list`
  );

  return res.data;
};

export default function Home() {
  const classes = useStyles();
  const { data: statementList, isLoading } = useQuery(
    "statementList",
    fetchStatementList
  );

  const defaultValues = {
    type: "statement",
    statement: "July%202020",
    start: "",
    end: "",
    breakdown: "all",
    resolution: "day",
  };

  const [formData, setFormData] = React.useState(defaultValues);
  const [query, setQuery] = React.useState(defaultValues);

  const { type, statement, start, end, breakdown, resolution } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setQuery(formData);
  };

  return (
    !isLoading && (
      <Container className={classes.root}>
        <Typography variant="h4" gutterBottom>
          Overview
        </Typography>

        <Grid container style={{ height: "70vh" }}>
          {/* form to change query params */}
          <Grid item xs={2}>
            <form onSubmit={handleSubmit}>
              <Grid container direction="column" className={classes.controls}>
                <Grid item>
                  <FormControl component="fieldset" fullWidth>
                    <RadioGroup
                      row
                      name="type"
                      value={type}
                      onChange={handleChange}
                    >
                      <FormControlLabel
                        value="statement"
                        control={<Radio color="primary" />}
                        label="Statement"
                      />
                      <FormControlLabel
                        value="date"
                        control={<Radio color="primary" />}
                        label="Date"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                <Grid item>
                  {type === "statement" ? (
                    <FormControl fullWidth variant="outlined" size="small">
                      <InputLabel>Statement</InputLabel>
                      <Select
                        name="statement"
                        value={statement}
                        onChange={handleChange}
                        label="Statement"
                      >
                        {statementList.map((statement) => (
                          <MenuItem
                            key={statement}
                            value={encodeURIComponent(statement.trim())}
                          >
                            {statement}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ) : (
                    <Box
                      display="flex"
                      flexDirection="column"
                      className={classes.controls}
                    >
                      <TextField
                        fullWidth
                        type="date"
                        size="small"
                        variant="outlined"
                        label="Start Date"
                        InputLabelProps={{ shrink: true }}
                        name="start"
                        value={start}
                        onChange={handleChange}
                      />
                      <TextField
                        fullWidth
                        type="date"
                        size="small"
                        variant="outlined"
                        label="End Date"
                        InputLabelProps={{ shrink: true }}
                        name="end"
                        value={end}
                        onChange={handleChange}
                      />
                    </Box>
                  )}
                </Grid>

                <Grid item>
                  <FormControl fullWidth variant="outlined" size="small">
                    <InputLabel>Breakdown</InputLabel>
                    <Select
                      label="Breakdown"
                      name="breakdown"
                      value={breakdown}
                      onChange={handleChange}
                    >
                      <MenuItem value="all">All</MenuItem>
                      <MenuItem value="category">Category</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item>
                  <FormControl fullWidth variant="outlined" size="small">
                    <InputLabel>Resolution</InputLabel>
                    <Select
                      label="Resolution"
                      name="resolution"
                      value={resolution}
                      onChange={handleChange}
                    >
                      <MenuItem value="day">Day</MenuItem>
                      <MenuItem value="month">Month</MenuItem>
                      <MenuItem value="year">Year</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item>
                  <Button type="submit" variant="outlined">
                    Apply
                  </Button>
                </Grid>

                <Grid item>
                  <Link
                    href={{
                      pathname: "/xray",
                      query: { type, statement, start, end },
                    }}
                    passHref
                  >
                    <Button color="primary" variant="contained">
                      XRay
                    </Button>
                  </Link>
                </Grid>
              </Grid>
            </form>
          </Grid>

          <Grid item xs={10}>
            <TimeSeriesLineGraph query={query} />
          </Grid>
        </Grid>
      </Container>
    )
  );
}
