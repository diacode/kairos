defmodule Kairos.ProjectChannel do
  use Kairos.Web, :channel
  require Logger
  alias Kairos.{Repo, Project}

  def join("project:" <> project_id, _params, socket) do
    Logger.info "Joined to ProjectChannel"

    project = Project
      |> Repo.get!(project_id)

    stories = Kairos.Story.Fetcher.get_stories(project.pivotal_tracker_id)

    {:ok, %{project: project, stories: stories}, assign(socket, :project, project)}
  end
end
