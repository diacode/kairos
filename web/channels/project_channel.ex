defmodule Kairos.ProjectChannel do
  use Kairos.Web, :channel
  require Logger
  alias Kairos.{Repo, Project}

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

  def handle_in("project:delete", _message, socket) do
    Logger.debug "Creating new project"

    current_user = socket.assigns.current_user
    project = socket.assigns.project

    if current_user.admin do
      Project
      |> Repo.get!(project.id)
      |> Repo.delete!

      Kairos.Project.Starter.remove_project(project.id)

      broadcast!(socket, "deleted", %{project: project})

      {:noreply, socket}
    else
      {:reply, {:error, %{reason: "Forbidden"}}, socket}
    end
  end

  def broadcast_update(project) do
    Kairos.Endpoint.broadcast("project:#{project.id}", "update", %{project: project})
  end
end
