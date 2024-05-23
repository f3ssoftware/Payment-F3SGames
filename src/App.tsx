import React from 'react';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./App.css";
import AppRoutes from './Routes/routes';

const App: React.FC = () => {
  return (

      <div style={{ height: '100vh' }}>
        <AppRoutes/>
      </div>
  
  );
}

export default App;
