defmodule Kairos.Project.ServerTest do
  use ExUnit.Case, async: true

  alias Kairos.{Repo, Project}
  alias Kairos.Project.Server

  @pivotal_tracker_project_id Application.get_env(:kairos, :pivotal_tracker_project_id)

  setup do
    project = %Project{}
      |> Project.changeset(%{name: "Test", pivotal_tracker_id: @pivotal_tracker_project_id, toggl_id: "123456"})
      |> Repo.insert!

    {:ok, pid} = Server.create(project)

    {:ok, project_id: project.id, pid: pid}
  end

  test "it creates a new Poject process", %{pid: pid} do
    assert is_pid(pid)
  end

  test "it has a list of time entries", %{project_id: project_id} do
    assert %{stories: stories} = Server.get_data(project_id)
    assert is_list(stories)
  end
end
