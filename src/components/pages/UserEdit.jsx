import React, { useEffect, useState } from 'react';
import './useredit.css';
import { useParams, useNavigate } from 'react-router-dom'; 
import BackEnd from '../../config/Index';
import Loanding from '../loading/Loanding';
import Modal from 'react-bootstrap/Modal'; 
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';



function UserEdit() {
  const { id } = useParams();
  const navigate = useNavigate(); 
  const [loadingremove, setLoadingremove] = useState(false);
  const [user, setUser] = useState({ name: '', email: '' });
  const [showModal, setShowModal] = useState(false); 
  const [message, setMessage] = useState(''); 

  useEffect(() => {
    setLoadingremove(false); 
    BackEnd.get(`/${id}`)
      .then((response) => {
        console.log('Usuário encontrado:', response.data.user);
        setUser(response.data.user);
        setLoadingremove(true); 
      })
      .catch((error) => {
        console.log('Erro ao buscar usuário:', error);
        alert('Erro ao buscar usuário:')
        navigate('/users'); 
        setLoadingremove(true);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoadingremove(false); 
    BackEnd.put(`/${id}`, user)
      .then((response) => {
        console.log('Usuário atualizado:', response.data);
        setMessage(response.data.message); 
        setShowModal(true); 
        setLoadingremove(true); 
      })
      .catch((error) => {
        console.log('Erro ao atualizar usuário:', error);
        alert('Erro ao atualizar usuário:');
        navigate('/users'); 
        setLoadingremove(true); 
      });
  };

  const handleClose = () => {
    setShowModal(false);
    navigate('/users'); 
  };

  return (
    <>
      {!loadingremove && <Loanding />}
      {loadingremove && (
        <form onSubmit={handleSubmit}>
          <div className="form_container-edit">
            <div className='form_control-edit'>
              <div>
                <label>Nome</label>
                <Form.Control
                  type="text"
                  name='name'
                  value={user.name}
                  onChange={handleChange}
                  placeholder='Nome'
                />
              </div>

              <div>
                <label>E-mail</label>
                <Form.Control
                  type="email"
                  name='email'
                  value={user.email}
                  onChange={handleChange}
                  placeholder='E-mail'
                />
              </div>
              <Button variant="success"  type="submit">Editar Usuário</Button>
            </div>
          </div>
        </form>
      )}

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Aviso!</Modal.Title>
        </Modal.Header>
        <Modal.Body>{message}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default UserEdit;
