import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import BackEnd from '../../config/Index';
import './styles.css';
import { useNavigate } from 'react-router-dom';
import Loanding from '../loading/Loanding';
import Input from '../form/Input';
import ButtonSubmit from '../form/ButtonSubmit';

function FormUser() {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    passwordconfirm: '',
  });

  const [passwordError, setPasswordError] = useState('');
  const [passwordMatchError, setPasswordMatchError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [registeredUser, setRegisteredUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(loadingTimer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === 'password') {
      if (value === '') {
        setPasswordError('');
      } else if (value.length < 8) {
        setPasswordError('A senha deve ter pelo menos 8 caracteres.');
      } else {
        setPasswordError('');
      }
    }

    if (name === 'passwordconfirm') {
      if (value !== userData.password) {
        setPasswordMatchError('As senhas não coincidem.');
      } else {
        setPasswordMatchError('');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (userData.password.length < 8) {
      setPasswordError('A senha deve ter pelo menos 8 caracteres.');
      return;
    }

    if (userData.password !== userData.passwordconfirm) {
      setPasswordMatchError('As senhas não coincidem.');
      return;
    }

    setLoading(true);

    BackEnd.post('/', userData)
      .then((response) => {
        console.log('Usuário criado com sucesso:', response.data);

        const { name, email } = userData;
        setRegisteredUser({ name, email });

        setShowModal(true);
      })
      .catch((error) => {
        if (error.response?.data?.error?.email) {
          alert(error.response.data.error.email);
        } else if (error.response?.data?.error?.password) {
          alert(error.response.data.error.password);
        } else if (error.response?.data?.error?.passwordconfirm) {
          alert(error.response.data.error.passwordconfirm[0]);
        } else {
          alert('Erro ao criar o usuário: Erro inesperado.', error);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/users');
  };

  return (
    <>
      {loading ? (
        <Loanding />
      ) : (
        <div>
          <p className='new-user-p'>Novo usuário</p>
          <form onSubmit={handleSubmit}>

            <div className="form_container-user">
              <div className="form_control-user">

                <Input
                  type='text'
                  text='Nome'
                  name='name'
                  placeholder='Insira o nome'
                  value={userData.name}
                  onChange={handleChange}
                />

                <Input
                  type='email'
                  text='E-mail'
                  name='email'
                  placeholder='Insira o e-mail'
                  value={userData.email}
                  onChange={handleChange}
                />

                <Input
                  type='password'
                  text='Senha'
                  name='password'
                  placeholder='Insira a senha'
                  value={userData.password}
                  onChange={handleChange}
                />
                {passwordError && <span className="error-message">{passwordError}</span>}


                <Input
                  type='password'
                  text='Confirma Senha'
                  name='passwordconfirm'
                  placeholder='Insira a confirma Senha'
                  value={userData.passwordconfirm}
                  onChange={handleChange}
                />
                <div className='pass-error'>
                  {passwordMatchError && <span className="error-message">{passwordMatchError}</span>}
                </div>

                <br />
                <ButtonSubmit />


              </div>
            </div>
          </form>

          <Modal show={showModal} onHide={handleCloseModal} centered>
            <Modal.Header closeButton>
              <Modal.Title>Usuário Cadastrado com Sucesso</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {registeredUser && (
                <>
                  <div className='modal-name'>
                    <p><strong>Nome: </strong>  {registeredUser.name}</p>
                    <p><strong>Email: </strong>  {registeredUser.email}</p>
                  </div>

                </>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="success" onClick={handleCloseModal}>
                Fechar
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      )}
    </>
  );
}

export default FormUser;
