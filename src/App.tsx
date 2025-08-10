import { Routes, Route, Link } from 'react-router-dom';
import CreateForm from './pages/CreateForm';
import PreviewForm from './pages/PreviewForm';
import MyForms from './pages/MyForms';
import { AppBar, Toolbar, Button, Container, Typography } from '@mui/material';

function App() {
  return (
    <>
      <AppBar
  position="static"
  sx={{
    backgroundColor: "#1976D2", // You can swap this with your exact hex from the other UI
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  }}
>
  <Toolbar>
    <Typography
      sx={{
        flexGrow: 1,
        fontWeight: 500,
        letterSpacing: "0.5px",
      }}
      variant="h6"
    >
      React Form Builder
    </Typography>
    <Button component={Link} to="/create" color="inherit" sx={{ textTransform: "uppercase" }}>
      Create
    </Button>
    <Button component={Link} to="/preview" color="inherit" sx={{ textTransform: "uppercase" }}>
      Preview
    </Button>
    <Button component={Link} to="/myforms" color="inherit" sx={{ textTransform: "uppercase" }}>
      My Forms
    </Button>
  </Toolbar>
</AppBar>
      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<CreateForm />} />
          <Route path="/create" element={<CreateForm />} />
          <Route path="/preview/:id?" element={<PreviewForm />} />
          <Route path="/myforms" element={<MyForms />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
