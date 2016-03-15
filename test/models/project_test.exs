defmodule Kairos.ProjectTest do
  use Kairos.ModelCase

  alias Kairos.Project

  @valid_attrs %{description: "some content", name: "some content", pivotal_tracker_id: 42, toggl_id: 42, start_date: "2016-01-01"}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = Project.changeset(%Project{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Project.changeset(%Project{}, @invalid_attrs)
    refute changeset.valid?
  end
end
