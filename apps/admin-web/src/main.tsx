import React from 'react';
import ReactDOM from 'react-dom/client';
import { Shell } from './components/layout/Shell';
import { CommandPalette } from './components/common/CommandPalette';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Shell />
    <CommandPalette />
  </React.StrictMode>
);
