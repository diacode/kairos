defmodule Kairos.Project.Fetcher do
  @moduledoc """
  Fetches projects in external services using their API clients
  """
  require Logger

  @pivotal_tracker_api_token Application.get_env(:kairos, :pivotal_tracker_api_token)
  @toggl_api_token Application.get_env(:kairos, :toggl_api_token)
  @toggl_workspace_id Application.get_env(:kairos, :toggl_workspace_id)

  def get_projects do
    Logger.debug("Getting external projects from services")

    [
      Task.async(fn -> get_pivotal_traker_projects end),
      Task.async(fn -> get_toggl_projects end)
    ]
    |> Enum.map(&(Task.await(&1)))
    |> Enum.into(%{})
  end

  def get_pivotal_traker_projects do
    projects = %{access_token: @pivotal_tracker_api_token}
      |> ExTracker.Client.new
      |> ExTracker.Projects.list(fields: ":default,current_velocity")

    {:pivotal_tracker_projects, projects}
  end

  def get_toggl_projects do
    projects = %{access_token: @toggl_api_token}
     |> Togglex.Client.new(:api)
     |> Togglex.Api.Workspaces.projects(@toggl_workspace_id)

    {:toggl_projects, projects}
  end
end
