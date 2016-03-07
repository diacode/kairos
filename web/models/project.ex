defmodule Kairos.Project do
  use Kairos.Web, :model

  schema "projects" do
    field :name, :string
    field :description, :string
    field :pivotal_tracker_id, :integer
    field :toggl_id, :integer

    timestamps
  end

  @required_fields ~w(name description pivotal_tracker_id toggl_id)
  @optional_fields ~w()

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
