defmodule Kairos.ScheduledReport.Scheduler do
  alias Kairos.{Repo, ScheduledReport}

  def schedule(sr) do
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
    IO.puts "Notifying ScheduledReport with id #{sr.id}"
  end
end
