import React, { useState, useEffect } from 'react';
import './seachuser.css';
import BackEnd from '../../config/Index';
import Loanding from '../loading/Loanding';
import { CiUser } from "react-icons/ci";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ReactPaginate from 'react-paginate';
import Form from 'react-bootstrap/Form';


function SeachUser() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentItems, setCurrentItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingremove, setLoadingremove] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    BackEnd.get('/')
      .then(response => {
        setUsers(response.data.users.data);
        setFilteredUsers(response.data.users.data);
        setLoadingremove(true);
      })
      .catch(error => {
        console.log(error);
        alert('Erro ao carregar os usuários.');
        setLoadingremove(true);
      });
  }, []);

  useEffect(() => {
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(filteredUsers.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(filteredUsers.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, filteredUsers]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % filteredUsers.length;
    setItemOffset(newOffset);
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  return (
    <div className='container-users'>
      {!loadingremove && <Loanding />}
      {loadingremove && (
        <>
          <Form.Control
            type="text"
            placeholder="Buscar por nome ou e-mail..."
            id="form-control"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '50%' }}
          />
          < br />
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td className='user'>
                      <CiUser onClick={() => handleUserClick(user)} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className='success-message'>Nenhum usuário encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className='pagination'>
            <ReactPaginate
              breakLabel="..."
              nextLabel="Próximo >"
              onPageChange={handlePageClick}
              pageRangeDisplayed={3}
              marginPagesDisplayed={2}
              pageCount={pageCount}
              previousLabel="< Anterior"
              containerClassName="pagination"
              pageClassName="page-item"
              pageLinkClassName="page-link"
              previousClassName="page-item"
              previousLinkClassName="page-link"
              nextClassName="page-item"
              nextLinkClassName="page-link"
              breakClassName="page-item"
              breakLinkClassName="page-link"
              activeClassName="active"
            />
          </div>
        </>
      )}

      {selectedUser && (
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Informações do Usuário</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className='modal-user'>
              <p><strong>ID:</strong> {selectedUser.id}</p>
              <p><strong>Nome:</strong> {selectedUser.name}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Criado:</strong> {new Date(selectedUser.created_at).toLocaleString('pt-BR')}</p>
              <p><strong>Atualizado:</strong> {new Date(selectedUser.updated_at).toLocaleString('pt-BR')}</p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Fechar
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

export default SeachUser;
