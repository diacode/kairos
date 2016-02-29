defmodule Kairos.UserChannel do
  use Kairos.Web, :channel

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
        {:reply, {:ok, %{user: user}}, socket}
      {:error, _changeset} ->
        {:reply, {:error,%{reason: "Invalid"}}, socket}
    end
  end
end
