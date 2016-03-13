defmodule Kairos.Repo.Migrations.AddTogglFieldsToProjects do
  use Ecto.Migration

  def change do
    alter table(:projects) do
      add :start_date, :date, null: false
    end
  end
end
