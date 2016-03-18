defmodule Kairos.Slack do
  use Slacker

  @token Application.get_env(:kairos, :slack_token)
  @channel_id Application.get_env(:kairos, :slack_channel_id)

  def start_link, do: start_link(@token, name: __MODULE__)

  def hello(message) do
    GenServer.cast(__MODULE__, {:say, message})
  end

  def handle_cast({:user_typing, _}, state), do: {:noreply, state}

  def handle_cast({:say, message}, state) do
    say self, @channel_id, message
   {:noreply, state}
  end
end
