import React, { useState, useEffect } from 'react';
import './userlist.css';
import { MdDeleteForever } from "react-icons/md";
import BackEnd from '../../config/Index';
import { Link } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Loanding from '../../components/loading/Loanding'
import { FaUserEdit } from "react-icons/fa";
import ReactPaginate from 'react-paginate';

function UserList() {
  const [users, setUsers] = useState([]);
  const [currentItems, setCurrentItems] = useState([]);
  const [show, setShow] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [msg, setMsg] = useState('');
  const [loadingremove, setLoadingremove] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 10;

  const handleShow = (id) => {
    setUserIdToDelete(id);
    setShow(true);
  };

  const handleClose = () => setShow(false);

  const confirmDelete = () => {
    if (userIdToDelete !== null) {
      BackEnd.delete(`/${userIdToDelete}`)
        .then(() => {
          const updatedUsers = users.filter(user => user.id !== userIdToDelete);
          setUsers(updatedUsers);
          setMsg('Usuário deletado com sucesso');
          setTimeout(() => setMsg(''), 6000);
          handleClose();
        })
        .catch(error => {
          console.log("Erro ao excluir usuário:", error);
          alert("Erro ao excluir usuário:");
          setLoadingremove(true);
          handleClose();
        });
    }
  };

  useEffect(() => {
    BackEnd.get('/')
      .then(response => {
        setUsers(response.data.users.data);
        setLoadingremove(true);
      })
      .catch(error => {
        console.log(error);
        alert('Erro ao carregar a lista de usuários');
        setLoadingremove(true);
      });
  }, []);

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(users.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(users.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, users]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % users.length;
    setItemOffset(newOffset);
  };

  return (
    <div className='container-users'>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>Tem certeza de que deseja excluir este usuário? </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Confirmar Exclusão
          </Button>
        </Modal.Footer>
      </Modal>

      <p className='new-user-p'>Listas usuário</p>

      <p className='success-message'>{msg}</p>


      {!loadingremove && <Loanding />}
      {loadingremove && (
        <>
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
                    <td className='icons'>
                      <MdDeleteForever className='delete' onClick={() => handleShow(user.id)} />
                      <Link to={`/useredit/${user.id}`} >
                        <FaUserEdit className='edit' />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className='success-message'>Nenhum usuário encontrado.</td>
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
    </div>
  );
}

export default UserList;
