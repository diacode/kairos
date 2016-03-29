defmodule Kairos.Event.ProjectsHandler do
  use GenEvent
  require Logger

  def handle_event(:updated, state) do
    Logger.debug "Handling updated event for projects"

    Kairos.Project.Starter.get_projects
    |> Enum.map(&Kairos.Project.Server.get_data/1)
    |> update_projects_channels
    |> update_users_channels

    {:ok, state}
  end

  def handle_event({:created, project}, state) do
    Logger.debug "Handling created event for projects"

    for user_id <- Kairos.Users.Monitor.get_state, do: spawn(fn -> Kairos.UserChannel.broad_cast_project_added(user_id, project) end)

    {:ok, state}
  end

  def handle_event({:removed, project_id}, state) do
    Logger.debug "Handling created event for projects"

    for user_id <- Kairos.Users.Monitor.get_state, do: spawn(fn -> Kairos.UserChannel.broad_cast_project_removed(user_id, project_id) end)
    Kairos.ProjectChannel.broadcast_delete(project_id)

    {:ok, state}
  end

  def handle_event(_other, state) do
    {:ok, state}
  end

  defp update_projects_channels(projects) do
    for project <- projects, do: spawn(fn -> Kairos.ProjectChannel.broadcast_update(project) end)

    projects
  end

  defp update_users_channels(projects) do
    for user_id <- Kairos.Users.Monitor.get_state, do: spawn(fn -> Kairos.UserChannel.broad_cast_projects_updated(user_id, projects) end)

    projects
  end
end
