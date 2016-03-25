defmodule Kairos.ScheduledReport.Scheduler do
  alias Kairos.{Repo, ScheduledReport}
  use Timex
  require Logger

  def schedule(sr) do
    Logger.debug "Scheduling report #{sr.id} with frequency #{sr.frequency}"

    job = %Quantum.Job{schedule: sr.frequency, task: fn -> process_notification(sr) end}
    Quantum.add_job("scheduled_report_#{sr.id}", job)
  end

  def schedule_all do
    ScheduledReport
    |> ScheduledReport.preload_all
    |> Repo.all
    |> Enum.each(&schedule(&1))
  end

  def unschedule(sr) do
    Quantum.delete_job("scheduled_report_#{sr.id}")
  end

  def process_notification(sr) do
    Logger.debug "Notifying ScheduledReport with id #{sr.id}"

    toggl_api_token = Application.get_env(:kairos, :toggl_api_token)
    toggl_workspace_id = Application.get_env(:kairos, :toggl_workspace_id)
    since = Date.today
    |> Timex.shift(days: -sr.days)
    |> Timex.format!("%Y-%m-%d", :strftime)

    # Retrieving the report from toggl_api
    toggl_query = %{
      workspace_id: toggl_workspace_id,
      project_ids: sr.project.toggl_id,
      since: since,
      until: Date.today |> Timex.format!("%Y-%m-%d", :strftime)
    }

    pdf = Togglex.Client.new(%{access_token: toggl_api_token}, :reports)
    |> Togglex.Reports.summary(toggl_query, :pdf)

    # TODO: Replace below code with real email sending
    File.write!("report.pdf", pdf)
  end
end
