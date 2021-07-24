import AppSignIn from 'container/app-signin/app-signin';
import AppMain from 'container/app-main/app-main';
import { Route, Switch } from 'react-router-dom';
import AppRegister from 'container/app-register/app-register';

const RouteWithSubRoutes = (route) => {
  return (
    <Route
      path={route.path}
      exact={route.exact}
      render={props => {
        return <route.component {...props} keyPath={route.keyPath} routes={route.nested} />
      }} 
    />
  );
}

export const RenderRoutes = ({ routes }) => {
  return (
    <Switch>
      {
        routes.map((route) => {
          return <RouteWithSubRoutes key={route.keyPath} {...route} />
        })
      }
      <Route component={() => <h1>Not Found!</h1>} />
    </Switch>
  );
}

const Routes = [
  {
    path: '/',
    keyPath: '/',
    exact: true,
    component: AppMain
  },
  {
    path: '/sign-in',
    keyPath: 'sign-in',
    exact: true,
    component: AppSignIn
  },
  {
    path: '/register',
    keyPath: 'register',
    exact: true,
    component: AppRegister
  }
]

export default Routes;