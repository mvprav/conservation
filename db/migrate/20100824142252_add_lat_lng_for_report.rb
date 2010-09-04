class AddLatLngForReport < ActiveRecord::Migration
  def self.up
    add_column :reports , :lat ,:float
    add_column :reports, :lng , :float
  end

  def self.down
    remove_column :reports,:lat
    remove_column :reports, :lng
  end
end
