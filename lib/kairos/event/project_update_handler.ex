defmodule Kairos.Event.ProjectUpdateHandler do
  use GenEvent
  require Logger

  def handle_event({:updated, %{project: project}}, state) do
    Logger.debug "Handling updated event for project #{project.id}"

    Kairos.ProjectChannel.broadcast_update(project)

    {:ok, state}
  end

  def handle_event(_other, state) do
    {:ok, state}
  end
end
