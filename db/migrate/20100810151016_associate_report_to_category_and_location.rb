class AssociateReportToCategoryAndLocation < ActiveRecord::Migration
  def self.up
    add_column :reports, :category_id, :integer
    add_column :reports, :location_id, :integer
  end

  def self.down
    remove_column :reports, :category_id
    remove_column :reports, :location_id
  end
end
