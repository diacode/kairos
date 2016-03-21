defmodule Kairos.Slack.Client do
  use Slacker
  use Slacker.Matcher

  alias Kairos.Slack.MessageFormatter

  @token Application.get_env(:kairos, :slack_token)
  @channel_id Application.get_env(:kairos, :slack_channel_id)
  @slack_bot_id Application.get_env(:kairos, :slack_bot_id)

  match ~r/Projects overview/, :projects_overview
  match ~r/Project ([0-9]+) status/, :project_status

  def start_link, do: start_link(@token, name: __MODULE__)

  def projects_udpated(projects) do
    GenServer.cast(__MODULE__, {:projects_updated, projects})
  end

  def handle_cast({:user_typing, _}, state), do: {:noreply, state}
  # def handle_cast({:message, _}, state), do: {:noreply, state}

  def handle_cast({:projects_updated, projects}, state) do
    post_message(projects, MessageFormatter.projects_updated(projects))

    {:noreply, state}
  end

  def projects_overview(_tars, _msg) do
    projects = Kairos.Project.Starter.get_projects

    post_message(projects, MessageFormatter.projects_overview(projects))
  end

  def project_status(_tars, _msg, project_id) do
    {project_id, _} =  Integer.parse(project_id)

    post_message([project_id], "")
  end

  defp post_message(projects, text) do
    params = [
      channel: @channel_id,
      as_user: true,
      text: text,
      attachments: MessageFormatter.projects_list(projects)
    ]

    Slacker.Web.chat_post_message(@token, params)
  end
end
