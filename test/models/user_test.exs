defmodule Kairos.UserTest do
  use Kairos.ModelCase

  alias Kairos.User

  @valid_attrs %{password: "some content", email: "john@test.com", first_name: "some content", last_name: "some content", admin: true}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = User.changeset(%User{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = User.changeset(%User{}, @invalid_attrs)
    refute changeset.valid?
  end
end
