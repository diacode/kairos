defmodule Kairos.Project.Server do
  use GenServer
  import Kairos.Project.Calculations
  require Logger

  defstruct [
    id: nil,
    pivotal_tracker_id: nil,
    toggl_id: nil,
    name: nil,
    description: nil,
    start_date: nil,
    stories: [],
    time_entries: [],
    total_story_points: 0,
    total_completed_points: 0,
    total_estimated_hours: 0,
    total_dedicated_hours: 0,
    velocity: 0
  ]

  def ref(project_id), do: {:global, {:project_id, project_id}}

  @doc """
  Creates a new Project process if it doesn't exist. If it's been previously
  created it returns it.
  """
  def create(project) do
    case GenServer.whereis(ref(project.id)) do
      nil -> Supervisor.start_child(Kairos.Project.Supervisor, [project])
      server -> server
    end
  end

  def start_link(project) do
    GenServer.start_link(Kairos.Project.Server, project, name: ref(project.id))
  end

  def init(project) do
    Logger.debug "Starting server for project #{project.id}"

    {:ok, build_data(project)}
  end

  @doc """
  Returns the state of the process
  """
  def get_data(project_id) do
    try_call(project_id, :get_data)
  end

  def handle_call(:get_data, _from, state) do
    {:reply, state, state}
  end

  def handle_info(:refresh, state) do
    Logger.debug "Refreshing server data for project #{state.id}"

    {:noreply, build_data(state)}
  end

  defp build_data(project) do
    stories = get_stories(project.pivotal_tracker_id)
    time_entries = get_time_entries(project.toggl_id, project.start_date)
    total_story_points = total_story_points(stories)
    total_completed_points = total_completed_points(stories)
    total_estimated_hours = total_estimated_hours(stories)
    total_dedicated_hours = total_dedicated_hours(time_entries)

    %__MODULE__{
      id: project.id,
      pivotal_tracker_id: project.pivotal_tracker_id,
      toggl_id: project.toggl_id,
      name: project.name,
      description: project.description,
      start_date: project.start_date,
      stories: stories,
      time_entries: time_entries,
      total_story_points: total_story_points,
      total_completed_points: total_completed_points,
      total_estimated_hours: total_estimated_hours,
      total_dedicated_hours: total_dedicated_hours,
      velocity: total_velocity(total_story_points, total_completed_points, total_estimated_hours, total_dedicated_hours)
    }
  end

  defp try_call(project_id, call_function) do
    case GenServer.whereis(ref(project_id)) do
      nil -> {:error, :invalid_project}
      project -> GenServer.call(project, call_function)
    end
  end

  defp get_stories(pivotal_tracker_id), do: Kairos.Story.Fetcher.get_stories(pivotal_tracker_id)
  defp get_time_entries(toggl_id, start_date), do: Kairos.TimeEntry.Fetcher.get_time_entries(toggl_id, start_date)
end
