defmodule Kairos.IntegrationCase do
  use ExUnit.CaseTemplate
  use Hound.Helpers

  alias Kairos.{Repo, User}

  using do
    quote do
      use Hound.Helpers

      import Ecto, only: [build_assoc: 2]
      import Ecto.Model
      import Ecto.Query, only: [from: 2]
      import Kairos.Router.Helpers
      import Kairos.IntegrationCase

      alias Kairos.Repo

      # The default endpoint for testing
      @endpoint Kairos.Endpoint

      hound_session
    end
  end

  setup tags do
    unless tags[:async] do
      Ecto.Adapters.SQL.restart_test_transaction(Kairos.Repo, [])
    end

    :ok
  end

  def create_user do
    %User{first_name: "John", last_name: "Doe", email: "john@kairos.com", admin: true}
    |> User.changeset(%{password: "12345678"})
    |> Repo.insert!
  end

  def user_sign_in(user) do
    navigate_to "/"

    sign_in_form = find_element(:id, "sign_in_form")

    sign_in_form
    |> find_within_element(:id, "user_email")
    |> fill_field(user.email)

    sign_in_form
    |> find_within_element(:id, "user_password")
    |> fill_field(user.password)

    sign_in_form
    |> find_within_element(:css, "button")
    |> click

    assert element_displayed?({:id, "authenticated_container"})
  end
end
