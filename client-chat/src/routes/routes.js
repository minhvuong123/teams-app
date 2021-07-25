import AppSignIn from 'container/app-signin/app-signin';
import AppMain from 'container/app-main/app-main';
import { Route, Switch } from 'react-router-dom';
import AppRegister from 'container/app-register/app-register';
import ChatContent from 'container/app-content/app-content-chat/chat-content/chat-content';

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
    exact: false,
    component: AppMain,
    nested: [
      {
        path: '/conversation/:id',
        keyPath: '/conversation/:id',
        exact: false,
        component: ChatContent,
      }
    ]
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