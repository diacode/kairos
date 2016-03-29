defmodule Kairos.Project.Starter do
  @moduledoc """
  Creates Kairos.Project.Server for each existing Project when
  application starts.
  """
  use GenServer
  require Logger

  alias Kairos.{Repo, Project}

  def start_link() do
    GenServer.start_link(__MODULE__, [], name: __MODULE__)
  end

  def init(_) do
    projects = Project
      |> Repo.all
      |> Enum.map(&do_start_project/1)
      |> Enum.map(&Task.await/1)

    plan_refresh_projects

    {:ok, %{projects: projects}}
  end

  @doc """
  Starts a new Kairos.Project.Server
  """
  def start_project(project) do
    GenServer.cast(__MODULE__, {:start_project, project})
  end

  @doc """
  Returns all started projects
  """
  def get_projects do
    GenServer.call(__MODULE__, :get_projects)
  end

  def remove_project(project_id) do
    GenServer.cast(__MODULE__, {:remove_project, project_id})
  end

  def handle_call(:get_projects, _from, %{projects: projects} = state) do
    {:reply, projects, state}
  end

  def handle_cast({:start_project, project}, %{projects: projects} = state) do
    Kairos.Project.Server.create(project)

    {:noreply, %{state | projects: [project.id | projects]}}
  end

  def handle_cast({:remove_project, project_id}, %{projects: projects} = state) do
    Kairos.Project.Server.stop(project_id)

    projects = List.delete(projects, project_id)

    Kairos.Project.Event.removed(project_id)

    {:noreply, %{projects: projects}}
  end

  def handle_info(:refresh_projects, %{projects: projects} = state) do
    Logger.debug "Start refreshing projects"

    projects
    |> Enum.map(&do_refresh_project/1)
    |> Enum.map(&Task.await/1)

    plan_refresh_projects

    Kairos.Project.Event.updated

    {:noreply, state}
  end

  defp do_start_project(project) do
    Task.async(
      fn ->
        Kairos.Project.Server.create(project)
        project.id
      end
    )
  end

  defp plan_refresh_projects do
    Process.send_after(self(), :refresh_projects, 5 * 60 * 1000)
  end

  defp do_refresh_project(project_id) do
    Task.async(
      fn ->
        project_id
        |> Kairos.Project.Server.ref
        |> GenServer.whereis
        |> send(:refresh)
      end
    )
  end
end
