import { IndexRoute, Route }      from 'react-router';
import React                      from 'react';
import MainLayout                 from '../layouts/main';
import Actions                    from '../actions/sessions';
import AuthenticatedContainer     from '../containers/authenticated';
import HomeIndexView              from '../views/home';
import SessionsNew                from '../views/sessions/new';
import SettingsIndexView          from '../views/settings/index';
import ProjectsNewView            from '../views/projects/new';
import ProjectsShowView           from '../views/projects/show';
import ProjectsShowStories        from '../views/projects/show/stories';
import ScheduledReportsIndexView  from '../views/scheduled_reports/index';
import ScheduledReportsNewView  from '../views/scheduled_reports/new';
import NotFoundView               from '../views/errors/not_found';

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
      <Route path="/sign_in" component={SessionsNew} />

      <Route path="/" component={AuthenticatedContainer} onEnter={_ensureAuthenticated}>
        <Route path="projects" component={HomeIndexView}>
          <Route path="new" component={ProjectsNewView} />
        </Route>
        <Route path="project/:id" component={ProjectsShowView}>
          <IndexRoute component={ProjectsShowStories} />
        </Route>
        <Route path="scheduled_reports" component={ScheduledReportsIndexView}>
          <Route path="new" component={ScheduledReportsNewView} />
        </Route>

        <Route path="settings" component={SettingsIndexView} />

        <Route path="*" component={NotFoundView} />
      </Route>
    </Route>
  );
}
