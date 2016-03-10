defmodule Kairos.UserChannel do
  use Kairos.Web, :channel
  require Logger

  alias Kairos.{Repo, User, Project}

  def join("users:" <> user_id, _params, socket) do
    Logger.info "Joined to UserChannel"

    current_user = socket.assigns.current_user

    if String.to_integer(user_id) == current_user.id do
      {:ok, socket}
    else
      {:error, %{reason: "Invalid user"}}
    end
  end

  def handle_in("user:update", %{"user" => params}, socket) do
    Logger.info "Updating user in UserChannel"

    current_user = socket.assigns.current_user

    current_user
    |> User.update_changeset(params)
    |> Repo.update
    |> case do
      {:ok, user} ->
        {:reply, {:ok, %{user: user}}, assign(socket, :current_user, user)}
      {:error, _changeset} ->
        {:reply, {:error, %{reason: "Invalid"}}, socket}
    end
  end

  def handle_in("user:projects", _params, socket) do
    Logger.info "Requesting projects from UserChannel"

    project_ids = Kairos.Project.Starter.projects

    projects = project_ids
      |> Enum.map(&Kairos.Project.Server.get_data(&1))

    {:reply, {:ok, %{projects: projects}}, socket}
  end

  def handle_in("user:external_projects", _params, socket) do
    Logger.info "Requesting external projects in UserChannel"

    projects = Kairos.Project.Fetcher.get_projects

    {:reply, {:ok, projects}, socket}
  end

  def handle_in("user:create_project", %{"project" => params}, socket) do
    Logger.info "Crating new project in UserChannel"

    current_user = socket.assigns.current_user

    if current_user.admin do
      project = %Project{}
        |> Project.changeset(params)
        |> Repo.insert!

      Kairos.Project.Starter.start_project(project)

      {:reply, {:ok, %{project: project}}, socket}
    else
      {:reply, {:error, %{reason: "Forbidden"}}, socket}
    end
  end
end
