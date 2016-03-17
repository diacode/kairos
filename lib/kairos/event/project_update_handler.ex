defmodule Kairos.Event.ProjectUpdateHandler do
  use GenEvent
  require Logger

  def handle_event({:updated, %{project: project}}, state) do
    Logger.debug "#{inspect project}"

    {:ok, state}
  end

  def handle_event(_other, state) do
    {:ok, state}
  end
end
