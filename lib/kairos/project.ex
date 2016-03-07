defmodule Kairos.Project do
  use GenServer

  @doc """
  Creates a new Project process if it doesn't exist. If it's been previously
  created it returns it.
  """
  def create(project_id) do
    case GenServer.whereis(ref(project_id)) do
      nil -> Supervisor.start_child(__MODULE__.Supervisor, [project_id])
      project -> project
    end
  end

  def start_link(project_id) do
    GenServer.start_link(__MODULE__, %{}, name: ref(project_id))
  end

  @doc """
  Returns the state of the process
  """
  def state(project_id) do
    try_call(project_id, :state)
  end

  def init(_) do
    # TODO load time entries from Extracker
    user_stories = []
    {:ok, %{user_stories: user_stories, }}
  end

  defp try_call(project_id, call_function) do
    case GenServer.whereis(ref(project_id)) do
      nil -> {:error, :invalid_project}
      project -> GenServer.call(project, call_function)
    end
  end

  def handle_call(:state, _from, state) do
    {:reply, state, state}
  end

  defp ref(project_id), do: {:global, {:project_id, project_id}}
end
