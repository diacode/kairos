defmodule Kairos.Slack.MessageFormatter do
  @slack_projects_url Application.get_env(:kairos, :slack_projects_url)

  def projects_overview(projects) do
    number_of_projects = length(projects)
    "We currently have *#{number_of_projects}* projects:"
  end

  def projects_updated(_projects), do: "Projects data updated:"

  def projects_list(projects) do
    projects
    |> Enum.map(&Kairos.Project.Server.get_data/1)
    |> Enum.map(&build_project_attachment/1)
    |> Poison.encode!
  end

  defp build_project_attachment(project) do
    %{
      id: id,
      name: name,
      description: description,
      velocity: velocity,
      total_story_points: total_story_points,
      total_completed_points: total_completed_points,
      total_estimated_hours: total_estimated_hours,
      total_dedicated_hours: total_dedicated_hours,
    } = project

    %{
      fallback: name,
      title: "#{name} status",
      title_link: @slack_projects_url <> to_string(id),
      text: description,
      color: project_status_color(velocity),
      fields: [
        %{
          title: "Total points",
          value: "#{total_completed_points}/#{total_story_points}",
          short: true
        },
        %{
          title: "Total hours",
          value: "#{total_dedicated_hours}/#{total_estimated_hours}",
          short: true
        },
        %{
          title: "Velocity",
          value: "#{velocity}%",
          short: true
        },
      ]
    }
  end

  defp project_status_color(velocity) when velocity < 100, do: "#D32F2F"
  defp project_status_color(_velocity), do: "#2C9B7F"
end
