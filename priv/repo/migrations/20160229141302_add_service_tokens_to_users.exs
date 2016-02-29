defmodule Kairos.Repo.Migrations.AddServiceTokensToUsers do
  use Ecto.Migration

  def change do
    alter table(:users) do
      add :settings, :map
    end
  end
end
