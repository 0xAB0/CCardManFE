import { useQuery } from "react-query";
import axios from "axios";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";

const fetchDetailsData = async (type, statement, start, end) => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/details/data?${
      type === "date" && end !== ""
        ? `start=${start}&end=${end}`
        : `statement=${statement}`
    }`
  );

  return res.data.rows;
};

const DetailsTable = ({ type, statement, start, end }) => {
  const { data: rows, error, isLoading } = useQuery(
    [type, statement, start, end],
    fetchDetailsData
  );

  if (isLoading) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <TableContainer style={{ maxHeight: 400 }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Category</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.rowId}>
              <TableCell component="th" scope="row">
                {row.date}
              </TableCell>
              <TableCell>{row.description}</TableCell>
              <TableCell>{row.amount}</TableCell>
              <TableCell>{row.category}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DetailsTable;
