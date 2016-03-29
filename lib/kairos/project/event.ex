defmodule Kairos.Project.Event do
  @handlers [
    Kairos.Event.ProjectsHandler
  ]

  def start_link do
    {:ok, manager} = GenEvent.start_link(name: __MODULE__)

    Enum.each(@handlers, &GenEvent.add_handler(manager, &1, []))

    {:ok, manager}
  end

  def updated() do
    GenEvent.notify(__MODULE__, :updated)
  end

  def created(project) do
    GenEvent.notify(__MODULE__, {:created, project})
  end

  def removed(project_id) do
    GenEvent.notify(__MODULE__, {:removed, project_id})
  end
end
