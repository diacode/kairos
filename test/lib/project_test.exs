defmodule Kairos.ProjectTest do
  use ExUnit.Case, async: true

  alias Kairos.Project

  setup do
    project_id = :crypto.strong_rand_bytes(32) |> Base.encode64()
    {:ok, pid} = Project.create(project_id)

    {:ok, project_id: project_id, pid: pid}
  end

  test "it creates a new Poject process", %{pid: pid} do
    assert is_pid(pid)
  end

  test "it has a list of time entries", %{project_id: project_id} do
    assert %{user_stories: user_stories} = Project.state(project_id)
    assert is_list(user_stories)
  end
end
