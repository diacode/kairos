defmodule Kairos.Story.Fetcher do
  @moduledoc """
  Wrapper for the API libraries for handling lists with multiple items which
  might need multiple requests for fetching all of them.
  """
  require Logger

  @pivotal_tracker_api_token Application.get_env(:kairos, :pivotal_tracker_api_token)
  @limit 500

  @doc """
  Fetches stories from Extracker using `offset` until the number
  of items received is less than `limit`, which means there are no
  more pages.
  """
  def get_stories(project_id), do: build_client |> get_stories(project_id)
  def get_stories(client, project_id, offset \\ 0, items \\ [])
  def get_stories(client, project_id, offset, items) do
    Logger.debug "Fetching stories for project #{project_id} with offset #{offset}"

    client
    |> do_get_stories(project_id, offset: offset)
    |> append(items, client, project_id, offset)
  end

  defp append(new_items, items, client, project_id, offset) when length(new_items) == @limit do
    get_stories(client, project_id, offset + @limit, items ++ new_items)
  end
  defp append(new_items, items, _, _, _), do: items ++ new_items

  defp build_client do
    ExTracker.Client.new(%{access_token: @pivotal_tracker_api_token})
  end

  defp do_get_stories(client, project_id, offset: offset) do
    ExTracker.Stories.list(client, project_id, offset: offset, limit: @limit)
  end
end
