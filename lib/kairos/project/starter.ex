defmodule Kairos.Project.Starter do
  @moduledoc """
  Creates Kairos.Project.Server for each existing Project when
  application starts.
  """
  use GenServer

  alias Kairos.{Repo, Project}

  def start_link() do
    GenServer.start_link(__MODULE__, [], name: __MODULE__)
  end

  def start_project(project) do
    GenServer.cast(__MODULE__, {:start_project, project})
  end

  def init(_) do
    projects = Project
      |> Repo.all
      |> Enum.map(fn (project) ->
          Kairos.Project.Server.create(project)
          project.id
        end)

    {:ok, %{projects: projects}}
  end

  def handle_cast({:start_project, project}, %{projects: projects} = state) do
    Kairos.Project.Server.create(project)

    {:noreply, %{state | projects: [project.id | projects]}}
  end
end
