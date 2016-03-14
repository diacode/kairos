defmodule Kairos.TimeEntry.Fetcher do
  @moduledoc """
  Wrapper for Toggl API client
  """

  require Logger
  require IEx
  alias Timex.Date

  @toggl_api_token Application.get_env(:kairos, :toggl_api_token)
  @toggl_workspace_id Application.get_env(:kairos, :toggl_workspace_id)

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
    |> Enum.map(&process_year(&1, client, project_id, start_date))
    |> List.flatten
  end

  def process_year(year_number, client, project_id, start_date) do
    since = Timex.shift(start_date, years: year_number)
    until = since
      |> Timex.shift(years: 1)
      |> Timex.shift(days: -1)

    get_time_entries(client, project_id, since, until)
  end

  def get_time_entries(client, project_id, since, until) do
    since_string = Timex.format!(since, "{YYYY}-{0M}-{D}")
    until_string = Timex.format!(until, "{YYYY}-{0M}-{D}")

    Logger.debug "Fetching time entries for project #{project_id} between #{since_string} #{until_string}"

    client
    |> Togglex.Reports.summary(%{workspace_id: @toggl_workspace_id, project_ids: project_id, since: since_string, until: until_string})
    |> Map.get(:data)
    |> List.first
    |> Map.get(:items)
  end

  defp build_client do
    Togglex.Reports.Client.new(%{access_token: @toggl_api_token})
  end
end
