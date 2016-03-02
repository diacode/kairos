defmodule Kairos.PageControllerTest do
  use Kairos.ConnCase

  test "GET /", %{conn: conn} do
    conn = get conn, "/"
    assert html_response(conn, 200) =~ "Kairos"
  end
end
