class IncidentImage < ActiveRecord::Migration
  def self.up
    create_table :incident_images do |t|
      t.string :image_file_name
      t.string :image_content_type
      t.integer :image_file_size
      t.datetime :image_updated_at
      t.integer :report_id
      t.timestamps
    end
  end

  def self.down
    drop_table :incident_images
  end
end
