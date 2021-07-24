
// routes
import Routes, { RenderRoutes } from 'routes/routes';

import './App.scss';

function App() {
  return (
    <div className="app">
      <RenderRoutes routes={Routes} />
    </div>
  );
}

export default App;
