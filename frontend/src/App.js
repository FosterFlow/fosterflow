import React, { useEffect } from 'react';
import Routes from './routes';

//Import Scss
import "./assets/scss/themes.scss";

import { useSelector } from 'react-redux';

function App() {
  const { layoutMode } = useSelector(state => ({
    layoutMode: state.Layout.layoutMode,
  }));

useEffect(() => {
  layoutMode && localStorage.setItem("layoutMode",layoutMode);
}, [layoutMode])

  return <Routes />;
};

export default App;
