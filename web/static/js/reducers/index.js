import { combineReducers }  from 'redux';
import { routerReducer }    from 'react-router-redux';
import session              from './session';
import registration         from './registration';
import header               from './header';
import projects             from './projects';
import currentProject       from './current_project';
import projectForm          from './project_form';

export default combineReducers({
  routing: routerReducer,
  session: session,
  registration: registration,
  header: header,
  projects: projects,
  currentProject: currentProject,
  projectForm: projectForm,
});
