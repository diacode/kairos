defmodule Kairos.Repo.Migrations.CreateProject do
  use Ecto.Migration

  def change do
    create table(:projects) do
      add :name, :string, null: false
      add :description, :text
      add :pivotal_tracker_id, :integer, null: false
      add :toggl_id, :integer, null: false

      timestamps
    end

    create index(:projects, [:pivotal_tracker_id])
    create index(:projects, [:toggl_id])
  end
end
