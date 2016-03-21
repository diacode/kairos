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
    post_message(MessageFormatter.projects_updated(projects))

    {:noreply, state}
  end

  def projects_overview(_tars, _msg) do
    projects = Kairos.Project.Starter.get_projects
    message = MessageFormatter.projects_overview(projects)
    attachments = MessageFormatter.projects_list(projects)

    post_message(message, attachments)
  end

  def project_status(_tars, _msg, project_id) do
    {project_id, _} =  Integer.parse(project_id)
    attachments = MessageFormatter.projects_list([project_id])

    post_message("", attachments)
  end

  defp post_message(text, attachments \\ []) do
    params = [
      channel: @channel_id,
      as_user: true,
      text: text,
      attachments: attachments
    ]

    Slacker.Web.chat_post_message(@token, params)
  end
end
