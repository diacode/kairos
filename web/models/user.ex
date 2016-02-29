defmodule Kairos.User do
  use Kairos.Web, :model

  alias Kairos.User.Settings

  @derive {Poison.Encoder, only: [:id, :first_name, :last_name, :email, :settings]}

  schema "users" do
    field :first_name, :string
    field :last_name, :string
    field :email, :string
    field :encrypted_password, :string

    field :password, :string, virtual: true

    embeds_one :settings, Settings

    timestamps
  end

  @required_fields ~w(first_name email password)
  @update_required_fields ~w(first_name email)
  @optional_fields ~w(encrypted_password last_name)

  @doc """
  Creates a changeset based on the `model` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(model, params \\ :empty) do
    model
    |> cast(params, @required_fields, @optional_fields)
    |> validate_format(:email, ~r/@/)
    |> validate_length(:password, min: 5)
    |> unique_constraint(:email, message: "Email already taken")
    |> generate_encrypted_password
  end

  def update_changeset(model, params \\ :empty) do
    model
    |> cast(params, @update_required_fields, @optional_fields)
    |> cast_embed(:settings, required: false)
    |> validate_format(:email, ~r/@/)
    |> unique_constraint(:email, message: "Email already taken")
  end

  defp generate_encrypted_password(current_changeset) do
    case current_changeset do
      %Ecto.Changeset{valid?: true, changes: %{password: password}} ->
        put_change(current_changeset, :encrypted_password, Comeonin.Bcrypt.hashpwsalt(password))
      _ ->
        current_changeset
    end
  end
end
