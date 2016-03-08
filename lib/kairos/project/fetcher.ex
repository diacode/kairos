defmodule Kairos.Project.Fetcher do
  @moduledoc """
  Fetches projects in external services using their API clients
  """
  require Logger

  @pivotal_tracker_api_token Application.get_env(:kairos, :pivotal_tracker_api_token)

  def get_projects do
    Logger.info("Getting external projects from services")

    [
      Task.async(fn -> get_pivotal_traker_projects end),
      Task.async(fn -> get_toggl_projects end)
    ]
    |> Enum.map(&(Task.await(&1)))
    |> Enum.into(%{})
  end

  def get_pivotal_traker_projects do
    client = ExTracker.Client.new %{access_token: @pivotal_tracker_api_token}
    projects = client |> ExTracker.Projects.list(fields: ":default,current_velocity")

    {:pivotal_tracker_projects, projects }
  rescue
    _ ->
      Logger.error("Error fetching Pivotal Tracker projects")
      {:pivotal_tracker_projects, [] }
  end

  def get_toggl_projects do
    {:toggl_projects, [%{id: 11111, name: "Sample project"}]}
  end
end
