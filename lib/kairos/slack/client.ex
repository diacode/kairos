defmodule Kairos.Slack.Client do
  use Slacker
  use Slacker.Matcher

  alias Kairos.Slack.MessageFormatter

  @token Application.get_env(:kairos, :slack_token)
  @channel_id Application.get_env(:kairos, :slack_channel_id)
  @slack_bot_id Application.get_env(:kairos, :slack_bot_id)

  match ~r/Projects overview/, :projects_overview

  def start_link, do: start_link(@token, name: __MODULE__)

  def projects_udpated(projects) do
    GenServer.cast(__MODULE__, {:projects_updated, projects})
  end

  def handle_cast({:user_typing, _}, state), do: {:noreply, state}
  # def handle_cast({:message, _}, state), do: {:noreply, state}

  def handle_cast({:projects_updated, projects}, state) do

    params = [
      channel: @channel_id,
      as_user: true,
      text: MessageFormatter.projects_updated(projects),
      attachments: MessageFormatter.projects_list(projects)
    ]

    Slacker.Web.chat_post_message(@token, params)

    {:noreply, state}
  end

  def projects_overview(_tars, _msg) do
    projects = Kairos.Project.Starter.get_projects

    params = [
      channel: @channel_id,
      as_user: true,
      text: MessageFormatter.projects_overview(projects),
      attachments: MessageFormatter.projects_list(projects)
    ]

    Slacker.Web.chat_post_message(@token, params)
  end
end
