defmodule Kairos.Event.ProjectUpdateHandler do
  use GenEvent
  require Logger

  def handle_event(:updated, state) do
    Logger.debug "Handling updated events for projects"

    projects = Kairos.Project.Starter.get_projects
      |> Enum.map(&Kairos.Project.Server.get_data/1)

    for project <- projects, do: spawn(fn -> Kairos.ProjectChannel.broadcast_update(project) end)
    for user_id <- Kairos.Users.Monitor.get_state, do: spawn(fn -> Kairos.UserChannel.broad_cast_projects_updated(user_id, projects) end)

    {:ok, state}
  end

  def handle_event(_other, state) do
    {:ok, state}
  end
end
