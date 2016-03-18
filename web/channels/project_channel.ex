defmodule Kairos.ProjectChannel do
  use Kairos.Web, :channel
  require Logger

  def join("project:" <> project_id, _params, socket) do
    Logger.debug "Joining project #{project_id} channel"

    project_id
    |> String.to_integer
    |> Kairos.Project.Server.get_data
    |> case do
      {:error, :invalid_project} ->
        {:error, %{reason: "Invalid project"}}

      project ->
        {:ok, project, assign(socket, :project, project)}
    end
  end

  def broadcast_update(project) do
    Kairos.Endpoint.broadcast("project:#{project.id}", "update", %{project: project})
  end
end
