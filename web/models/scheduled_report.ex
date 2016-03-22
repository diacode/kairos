defmodule Kairos.ScheduledReport do
  use Kairos.Web, :model
  alias Kairos.Project

  @derive {Poison.Encoder, only: [:id, :name, :days, :frequency, :recipients, :cc, :cco, :project_id]}

  schema "scheduled_reports" do
    field :name, :string
    field :days, :integer
    field :frequency, :string

    # Recipients fields
    field :recipients, {:array, :string}
    field :cc, {:array, :string}
    field :cco, {:array, :string}

    # Association
    belongs_to :project, Project

    timestamps
  end

  @required_fields ~w(days frequency project_id)
  @optional_fields ~w(name recipients cc cco)

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
