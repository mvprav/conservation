class AddingImagesToDb < ActiveRecord::Migration
  def self.up
    add_column :incident_images, :images_file, :binary,:size=>400000
  end

  def self.down
    drop_column :incident_images,:images_file
  end
end
