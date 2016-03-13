defmodule Kairos.TimeEntry.Fetcher do
  @moduledoc """
  Wrapper for Toggl API client
  """

  require Logger

  @toggl_api_token Application.get_env(:kairos, :toggl_api_token)
  @toggl_workspace_id Application.get_env(:kairos, :toggl_workspace_id)
  @limit 50

  def get_time_entries(project_id, start_date), do: build_client |> get_time_entries(project_id, start_date)
  def get_time_entries(client, project_id, start_date, page \\ 1, items \\ [])
  def get_time_entries(client, project_id, start_date, page, items) do
    Logger.debug "Fetching time entries for project #{project_id} and page #{page}"

    client
    |> do_get_time_entries(project_id, start_date, page)
    |> append(items, client, project_id, start_date, page)
  end

  defp append(new_items, items, client, project_id, start_date, page) when length(new_items) == @limit do
    get_time_entries(client, project_id, start_date, (page + 1), items ++ new_items)
  end
  defp append(new_items, items, _, _, _, _), do: items ++ new_items

  defp build_client do
    Togglex.Reports.Client.new(%{access_token: @toggl_api_token})
  end

  defp do_get_time_entries(client, project_id, start_date, page) do
    client
    |> Togglex.Reports.detailed(%{workspace_id: @toggl_workspace_id, project_ids: project_id, since: start_date, page: page})
    |> Map.get(:data)
  end
end
