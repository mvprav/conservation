class AddVideoLink < ActiveRecord::Migration
  def self.up
  add_column :reports, :video, :string
  end
  

  def self.down
  remove_column :reports, :video
  end
end
