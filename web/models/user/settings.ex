defmodule Kairos.User.Settings do
  use Ecto.Model

  embedded_schema do
    field :pivotal_traker_api_token
    field :toggle_api_token
  end
end
