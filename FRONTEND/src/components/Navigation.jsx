import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();

  return (
    <Navbar bg="primary" expand="sm" className="mb-4 p-3" data-bs-theme="dark">
      <Navbar.Brand as={Link} to="/">News App</Navbar.Brand>
      <Nav className="mr-auto">
        <Nav.Link as={Link} to="/" active={location.pathname === '/'}>New</Nav.Link>
        <Nav.Link as={Link} to="/archived" active={location.pathname === '/archived'}>Archived</Nav.Link>
      </Nav>
    </Navbar>
  );
}

export default Navigation;