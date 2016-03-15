import Constants    from '../constants';
import ProjectStory from '../utils/project_story';

const initialState = {
  projectStories: null,
  channel: null,
  error: null,
};

function buildProjectStories(project) {
  const { stories, time_entries } = project;

  return stories.map((story) => {
    const id = `#${story.id} ${story.name}`;
    const timeEntry = time_entries.find((item) => {return item.title.time_entry === id;});

    const dedicatedHours = timeEntry != null ? Math.round(timeEntry.time / 3600000) : 0;

    return new ProjectStory({
      id: story.id,
      name: story.name,
      estimate: story.estimate,
      status: story.current_state,
      dedicatedHours: dedicatedHours,
    });
  });
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case Constants.CURRENT_PROJECT_SET:
      const projectStories = buildProjectStories(action.project);

      return { ...state, ...action.project, channel: action.channel, error: null, projectStories: projectStories };

    case Constants.CURRENT_PROJECT_ERROR:
      return { ...state, error: action.error };

    case Constants.CURRENT_PROJECT_RESET:
      return { ...initialState };

    default:
      return state;
  }
}
