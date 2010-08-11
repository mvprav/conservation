class AddIncidentDateToReport < ActiveRecord::Migration
  def self.up
    add_column :reports, :incident_date, :date
  end

  def self.down
    remove_column :reports, :incident_date
  end
end
