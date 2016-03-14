defmodule Kairos.TimeEntry.Fetcher do
  @moduledoc """
  Wrapper for Toggl API client
  """

  require Logger
  require IEx
  alias Timex.Date

  @toggl_api_token Application.get_env(:kairos, :toggl_api_token)
  @toggl_workspace_id Application.get_env(:kairos, :toggl_workspace_id)
  @limit 50

  def get_time_entries(project_id, start_date), do: build_client |> get_time_entries(project_id, start_date)
  def get_time_entries(client, project_id, start_date) do
    today = Date.now

    start_date = start_date
      |> Ecto.Date.to_erl
      |> Date.from_erl

    years = start_date
      |> Date.diff(today, :years)

    years..0
    |> Enum.to_list
    |> Enum.map(fn(year_number) ->
      since = Timex.shift(start_date, years: year_number)
      until = since
        |> Timex.shift(years: 1)
        |> Timex.shift(days: -1)

      since_string = Timex.format!(since, "{YYYY}-{0M}-{D}")
      until_string = Timex.format!(until, "{YYYY}-{0M}-{D}")
      
      get_time_entries(client, project_id, since_string, until_string)
    end)
    |> List.flatten
  end

  def get_time_entries(client, project_id, since, until) do
    Logger.debug "Fetching time entries for project #{project_id} between #{since} #{until}"

    client
    |> Togglex.Reports.summary(%{workspace_id: @toggl_workspace_id, project_ids: project_id, since: since, until: until})
    |> Map.get(:data)
    |> List.first
    |> Map.get(:items)
  end

  defp build_client do
    Togglex.Reports.Client.new(%{access_token: @toggl_api_token})
  end
end
