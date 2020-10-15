import Link from "next/link";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import ImportBtn from "./ImportBtn";

const Navbar = () => {
  return (
    <AppBar position="static" color="default" elevation={0}>
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Credit Card Insights
        </Typography>

        <Link href="/" passHref>
          <Button>Overview</Button>
        </Link>

        <ImportBtn />
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
