defmodule Kairos.Event.ProjectUpdateHandler do
  use GenEvent
  require Logger

  def handle_event(:updated, state) do
    Logger.debug "Handling updated events for projects"

    Kairos.Project.Starter.get_projects
    |> send_slack_notification
    |> Enum.map(&Kairos.Project.Server.get_data/1)
    |> update_projects_channels
    |> update_users_channels

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

  defp send_slack_notification(projects) do
    Kairos.Slack.Client.projects_udpated(projects)

    projects
  end
end
