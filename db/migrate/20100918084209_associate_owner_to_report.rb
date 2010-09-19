class AssociateOwnerToReport < ActiveRecord::Migration
  def self.up
    add_column :reports, :user_id , :integer
  end

  def self.down
    drop_column :reports, :user_id
  end
end
