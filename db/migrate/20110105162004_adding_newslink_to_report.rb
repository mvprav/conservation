class AddingNewslinkToReport < ActiveRecord::Migration
  def self.up
    add_column :reports , :newslink , :string
  end

  def self.down
    remove_column :reports, :newslink
  end
end
