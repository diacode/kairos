defmodule Kairos.UserChannel do
  use Kairos.Web, :channel
  require Logger

  alias Kairos.{Repo, User}

  def join("users:" <> user_id, _params, socket) do
    current_user = socket.assigns.current_user

    if String.to_integer(user_id) == current_user.id do
      {:ok, socket}
    else
      {:error, %{reason: "Invalid user"}}
    end
  end

  def handle_in("user:update", params, socket) do
    current_user = socket.assigns.current_user

    current_user
    |> User.update_changeset(params)
    |> Repo.update
    |> case do
      {:ok, user} ->
        {:reply, {:ok, %{user: user}}, assign(socket, :current_user, user)}
      {:error, _changeset} ->
        {:reply, {:error,%{reason: "Invalid"}}, socket}
    end
  end

  def handle_in("user:projects", _params, socket) do
    Logger.info "Requesting projects from UserChannel"

    current_user = socket.assigns.current_user

    client = ExTracker.Client.new %{access_token: current_user.settings.pivotal_tracker_api_token}
    projects = client |> ExTracker.Projects.list(fields: ":default,current_velocity")

    {:reply, {:ok, %{projects: projects}}, socket}
  rescue
    _ ->
      {:reply, {:error, %{reason: "Error in API call"}}, socket}
  end
end
