class AddingAdditionalFieldsDuringRegistration < ActiveRecord::Migration
  def self.up
    add_column :users,:firstname,:string
    add_column :users,:phone_number,:string
    add_column :users,:address,:string
    add_column :users,:city,:string
    add_column :users,:state,:string
    add_column :users,:postal_code,:string
    add_column :users,:country,:string
  end

  def self.down
    remove_column :users,:firstname
    remove_column :users,:phone_number
    remove_column :users,:removeress
    remove_column :users,:city
    remove_column :users,:state
    remove_column :users,:postal_code
    remove_column :users,:country
  end
end
