defmodule Kairos.User.Settings do
  use Ecto.Model

  @derive {Poison.Encoder, only: [:pivotal_tracker_api_token, :toggle_api_token]}

  embedded_schema do
    field :pivotal_tracker_api_token, :string
    field :toggle_api_token, :string
  end

  @required_fields ~w()
  @optional_fields ~w(pivotal_tracker_api_token toggle_api_token)

  @doc """
  Creates a changeset based on the `model` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(model, params \\ :empty) do
    model
    |> cast(params, @required_fields, @optional_fields)
  end
end
