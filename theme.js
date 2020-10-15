import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  overrides: {
    MuiTableHead: {
      root: {
        backgroundColor: "#f5f5f5",
      },
    },
  },
});

export default theme;
