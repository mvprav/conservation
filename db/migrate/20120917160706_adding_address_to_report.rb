class AddingAddressToReport < ActiveRecord::Migration
  def up
    add_column :reports , :address ,:string
  end

  def down
    remove_column :reports , :address
  end
end
