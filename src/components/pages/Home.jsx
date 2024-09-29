import React, { useState, useEffect } from 'react';
import './home.css';
import LinkButton from '../layout/LinkButton';
import Loanding from '../../components/loading/Loanding';

function Home() {
  const [loadingremove, setLoadingremove] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingremove(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className='home'>
        {loadingremove && <Loanding />}
        {!loadingremove && (
          <div className='container-home'>
            <div className='home-Container'>
              <h1>Bem-vindo</h1>
              <p>
                Comece a gerenciar os seus funcionários agora mesmo!
              </p>
              <LinkButton className='btn' to='/newuser' text='Criar Projeto' />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Home;
