ExUnit.start

Mix.Task.run "ecto.create", ~w(-r Kairos.Repo --quiet)
Mix.Task.run "ecto.migrate", ~w(-r Kairos.Repo --quiet)
Ecto.Adapters.SQL.begin_test_transaction(Kairos.Repo)

