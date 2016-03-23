defmodule Kairos.UserChannel do
  use Kairos.Web, :channel
  require Logger

  alias Kairos.{Repo, User, Project, ScheduledReport}
  alias Kairos.ScheduledReport.Scheduler, as: ReportScheduler

  def join("users:" <> user_id, _params, socket) do
    Logger.debug "Joining user #{user_id} channel"

    current_user = socket.assigns.current_user

    if String.to_integer(user_id) == current_user.id do
      Kairos.Users.Monitor.add_user(current_user.id)

      {:ok, socket}
    else
      {:error, %{reason: "Invalid user"}}
    end
  end

  def handle_in("user:update", %{"user" => params}, socket) do
    Logger.debug "Updating user"

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
    Logger.debug "Requesting projects"

    project_ids = Kairos.Project.Starter.get_projects

    projects = project_ids
      |> Enum.map(&Kairos.Project.Server.get_data(&1))

    {:reply, {:ok, %{projects: projects}}, socket}
  end

  def handle_in("user:external_projects", _params, socket) do
    Logger.debug "Requesting external projects"

    projects = Kairos.Project.Fetcher.get_projects

    {:reply, {:ok, projects}, socket}
  end

  def handle_in("user:create_project", %{"project" => params}, socket) do
    Logger.debug "Creating new project"

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

  def handle_in("user:scheduled_reports", _params, socket) do
    Logger.debug "Requesting scheduled reports"
    scheduled_reports = ScheduledReport
      |> ScheduledReport.preload_all
      |> Repo.all
    {:reply, {:ok, %{scheduled_reports: scheduled_reports}}, socket}
  end

  def handle_in("user:create_scheduled_report", %{"scheduled_report" => params}, socket) do
    Logger.debug "Creating new scheduled report"

    current_user = socket.assigns.current_user

    if current_user.admin do
      scheduled_report = %ScheduledReport{}
        |> ScheduledReport.changeset(params)
        |> Repo.insert!

      ReportScheduler.schedule(scheduled_report)

      {:reply, {:ok, %{scheduled_report: scheduled_report}}, socket}
    else
      {:reply, {:error, %{reason: "Forbidden"}}, socket}
    end
  end

  def broad_cast_projects_updated(user_id, projects) do
    Kairos.Endpoint.broadcast("users:#{user_id}", "update_projects", %{projects: projects})
  end

  def terminate(_reason, socket) do
    current_user = socket.assigns.current_user

    Kairos.Users.Monitor.remove_user(current_user.id)

    :ok
  end
end
