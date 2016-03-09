alias Kairos.{Repo, User}

Repo.delete_all User

[
  %{first_name: "Bruno", email: "bruno@diacode.com", password: "12345678", admin: false},
  %{first_name: "Ricardo", email: "ricardo@diacode.com", password: "12345678", admin: true}
]
|> Enum.map(&User.changeset(%User{}, &1))
|> Enum.each(&Repo.insert!(&1))
