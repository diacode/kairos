defmodule Kairos.CurrentUserController do
  use Kairos.Web, :controller

  plug Guardian.Plug.EnsureAuthenticated, handler: Kairos.SessionController

  def show(conn, _) do
    user = Guardian.Plug.current_resource(conn)

    conn
    |> put_status(:ok)
    |> render("show.json", user: user)
  end
end
