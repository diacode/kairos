defmodule Kairos.Repo.Migrations.CreateScheduledReports do
  use Ecto.Migration

  def change do
    create table(:scheduled_reports) do
      add :name, :string
      add :days, :integer, null: false
      add :frequency, :string, null: false

      add :recipients, {:array, :string}, default: []
      add :cc, {:array, :string}, default: []
      add :cco, {:array, :string}, default: []

      add :project_id, references(:projects), null: false

      timestamps
    end
  end
end
