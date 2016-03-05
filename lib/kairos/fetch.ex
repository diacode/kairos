defmodule Kairos.Fetch do
  @moduledoc """
  Wrapper for the API libraries for handling lists with multiple items which
  might need multiple requests for fetching all of them.
  """
  require Logger

  @limit 500

  @doc """
  Fetches stories from Extracker using `offset` until the number
  of items received is less than `limit`, which means there are no
  more pages.
  """
  @spec stories(ExTracker.Client.t, pos_integer, pos_integer, list) :: list | fun
  def stories(client, project_id, offset \\ 0, items \\ [])
  def stories(client, project_id, offset, items) do
    Logger.info "Fetching for project #{project_id} with offset #{offset}"

    client
    |> get_stories(project_id, offset: offset)
    |> append(items, client, project_id, offset)
  end

  defp append(new_items, items, client, project_id, offset) when length(new_items) == @limit do
    stories(client, project_id, offset + @limit, items ++ new_items)
  end
  defp append(new_items, items, _, _, _), do: items ++ new_items

  defp get_stories(client, project_id, offset: offset) do
    ExTracker.Stories.list(client, project_id, offset: offset, limit: @limit)
  end
end
