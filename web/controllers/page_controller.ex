defmodule Kairos.PageController do
  use Kairos.Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
