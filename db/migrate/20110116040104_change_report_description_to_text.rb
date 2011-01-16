class ChangeReportDescriptionToText < ActiveRecord::Migration
  def self.up
    change_column :reports, :description , :text
  end

  def self.down
  end
end
