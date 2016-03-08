defmodule Kairos.ProjectChannel do
  use Kairos.Web, :channel
  require Logger

  def join("project:" <> project_id, _params, socket) do
    Logger.info "Joined to ProjectChannel"

    current_user = socket.assigns.current_user

    client = ExTracker.Client.new %{access_token: current_user.settings.pivotal_tracker_api_token}
    project = ExTracker.Projects.find(client, project_id)
    stories = Kairos.UserStory.Fetcher.stories(client, project_id)

    {:ok, %{project: project, stories: stories}, socket}
  rescue
    error ->
      Logger.error error
      {:error, %{reason: "Error retrieving project from Pivotal Tracker"}}
  end
end
