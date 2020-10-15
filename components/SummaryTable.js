import { useQuery } from "react-query";
import axios from "axios";
import Typography from "@material-ui/core/Typography";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Paper from "@material-ui/core/Paper";

const fetchSummaryData = async (name, type, statement, start, end) => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/summary/${name}?${
      type === "date" && end !== ""
        ? `start=${start}&end=${end}`
        : `statement=${statement}`
    }`
  );

  return res.data;
};

const SummaryTable = ({ name, type, statement, start, end }) => {
  const { data: rows, error, isLoading } = useQuery(
    [name, type, statement, start, end],
    fetchSummaryData
  );

  if (isLoading) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <>
      <Typography variant="h6" gutterBottom>
        {name}
      </Typography>

      <TableContainer component={Paper} style={{ width: 250 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default SummaryTable;
