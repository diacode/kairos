defmodule Kairos.Users.Monitor do
  use GenServer

  # Client
  ############

  def start_link() do
    GenServer.start_link(__MODULE__, [], name: __MODULE__)
  end

  def init(_), do: {:ok, []}

  def add_user(user_id) do
    GenServer.cast(__MODULE__, {:add_user, user_id})
  end

  def remove_user(user_id) do
    GenServer.cast(__MODULE__, {:remove_user, user_id})
  end

  def get_state do
    GenServer.call(__MODULE__, :get_state)
  end

  # Server
  ############

  def handle_cast({:add_user, user_id}, state), do: {:noreply, Enum.uniq([user_id | state])}

  def handle_cast({:remove_user, user_id}, state), do: {:noreply, List.delete(state, user_id)}

  def handle_call(:get_state, _from, state), do: {:reply, state, state}
end
