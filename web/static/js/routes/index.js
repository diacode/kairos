import { IndexRoute, Route }    from 'react-router';
import React                    from 'react';
import MainLayout               from '../layouts/main';
import AuthenticatedContainer   from '../containers/authenticated';
import HomeIndexView            from '../views/home';
import RegistrationsNew         from '../views/registrations/new';
import SessionsNew              from '../views/sessions/new';
import SettingsIndexView        from '../views/settings/index';
import ProjectsCreateView       from '../views/projects/create';
import ProjectsShowView         from '../views/projects/show';
import Actions                  from '../actions/sessions';

export default function configRoutes(store) {
  const _ensureAuthenticated = (nextState, replace, callback) => {
    const { dispatch } = store;
    const { session } = store.getState();
    const { currentUser } = session;

    if (!currentUser && localStorage.getItem('phoenixAuthToken')) {
      dispatch(Actions.currentUser());
    } else if (!localStorage.getItem('phoenixAuthToken')) {
      replace('/sign_in');
    }

    callback();
  };

  return (
    <Route component={MainLayout}>
      <Route path="/sign_up" component={RegistrationsNew} />
      <Route path="/sign_in" component={SessionsNew} />

      <Route path="/" component={AuthenticatedContainer} onEnter={_ensureAuthenticated}>
        <IndexRoute component={HomeIndexView} />
        <Route path="projects/create" component={ProjectsCreateView} />
        <Route path="projects/:id" component={ProjectsShowView} />

        <Route path="settings" component={SettingsIndexView} />
      </Route>
    </Route>
  );
}
