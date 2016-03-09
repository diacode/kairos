defmodule Kairos.Project.Server do
  use GenServer

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
    stories = project.pivotal_tracker_id
      |> Kairos.Story.Fetcher.get_stories

    {:ok, %{project: project, stories: stories}}
  end

  @doc """
  Returns the state of the process
  """
  def get_state(project_id) do
    try_call(project_id, :get_state)
  end

  defp try_call(project_id, call_function) do
    case GenServer.whereis(ref(project_id)) do
      nil -> {:error, :invalid_project}
      project -> GenServer.call(project, call_function)
    end
  end

  def handle_call(:get_state, _from, state) do
    {:reply, state, state}
  end

  defp ref(project_id), do: {:global, {:project_id, project_id}}
end
