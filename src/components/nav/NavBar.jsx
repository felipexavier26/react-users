import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import './navbar.css'
import Home from '../pages/Home'
import NewUser from '../pages/NewUser'
import UserEdit from '../pages/UserEdit';
import UserList from '../pages/UserList';
import SearchUser from '../pages/SearchUser';


function NavBar() {
    return (
        <>
            <BrowserRouter>
                <nav>
                    <Link to='/'>Home</Link>
                    <Link to='/searchuser'>Procurar usuários</Link>
                    <Link to='/users'>Usuários</Link>
                    <Link to='/newuser'>Novo usuário</Link>
                </nav>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/searchuser' element={<SearchUser />}>Pesquisar user</Route>
                    <Route path='/newuser' element={<NewUser />} />
                    <Route path='/users' element={<UserList />} />
                    <Route path='/userEdit/:id' element={<UserEdit />} />
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default NavBar