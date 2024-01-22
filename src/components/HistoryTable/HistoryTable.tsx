import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon
} from '@mui/icons-material';

export const returnHistoryTypeIcon = (type: string) => {
  switch (type) {
    case "+":
      return <AddIcon />;
    case "~":
      return <EditIcon />;
    case "-":
      return <DeleteIcon />;
    default:
      return "";
  }
}

export default function HistoryTable({ tableData, historyColumns }: { tableData: Array<{ [key: string]: any }>, historyColumns: any[] }) {

  return (
    <Container maxWidth={false} disableGutters>
      <Typography variant="h6" gutterBottom>
        History
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="history-table">
          <TableHead>
            <TableRow>
              {historyColumns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ top: 57, minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row) => (
              <TableRow
                key={row.history_id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                {historyColumns.map((column) => (
                  <TableCell component="th" scope="row">
                    {column.format && row[column.id] ? column.format(row[column.id]) : row[column.id]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );

}