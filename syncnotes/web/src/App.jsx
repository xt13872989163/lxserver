import React from 'react';
import { NotesProvider } from './context/NotesContext';
import NotesPage from './pages/NotesPage';

const App = () => {
  return (
    <NotesProvider>
      <NotesPage />
    </NotesProvider>
  );
};

export default App;
