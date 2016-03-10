defmodule Kairos.ProjectChannel do
  use Kairos.Web, :channel
  require Logger

  def join("project:" <> project_id, _params, socket) do
    Logger.info "Joined to ProjectChannel"

    project = project_id
      |> String.to_integer
      |> Kairos.Project.Server.get_state

    {:ok, project, assign(socket, :project, project)}
  end
end
