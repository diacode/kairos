defmodule Kairos.Project do
  use Kairos.Web, :model

  @derive {Poison.Encoder, only: [:id, :name, :description, :pivotal_tracker_id, :toggl_id]}

  schema "projects" do
    field :name, :string
    field :description, :string
    field :pivotal_tracker_id, :integer
    field :toggl_id, :integer
    field :toggl_workspace_id, :integer
    field :start_date, Ecto.Date

    timestamps
  end

  @required_fields ~w(name pivotal_tracker_id toggl_id toggl_workspace_id start_date)
  @optional_fields ~w(description)

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
