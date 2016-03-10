defmodule Kairos.Project.Calculations do
  @moduledoc """
  Calculates a Project state depending on stories and time entries
  """

  def total_story_points(stories) do
    stories
    |> Enum.reduce(0, fn(story, acc) -> story.estimate + acc end)
  end

  def total_completed_points(stories) do
    stories
    |> Enum.filter(&(&1.current_state == "accepted"))
    |> total_story_points
  end

  def total_estimated_hours(stories) do
    stories
    |> Enum.reduce(0, fn(story, acc) -> estimated_hours(story.estimate) + acc end)
  end

  defp estimated_hours(1), do: 4
  defp estimated_hours(2), do: 8
  defp estimated_hours(3), do: 16
  defp estimated_hours(_), do: 0
end
