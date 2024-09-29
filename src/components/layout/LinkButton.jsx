import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css';
import Button from 'react-bootstrap/Button';

function LinkButton({ to, text }) {
  return (
    <Button as={Link} to={to} variant="primary">
      {text}
    </Button>
  );
}

export default LinkButton;
