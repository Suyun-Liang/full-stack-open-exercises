import { AppBar, Button, Toolbar, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";

function NavBar({ user, onLogout }) {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          noWrap
          component="a"
          href="/"
          sx={{
            mr: 2,
            fontWeight: 700,
            letterSpacing: ".3rem",
            color: "inherit",
            textDecoration: "none",
          }}
        >
          Blog App
        </Typography>
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button color="inherit" component={Link} to="/">
            blogs
          </Button>
          {!user ? (
            <Button color="inherit" component={Link} to="/login">
              login
            </Button>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/create">
                new blog
              </Button>
              <Button color="inherit" onClick={onLogout}>
                log out
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
