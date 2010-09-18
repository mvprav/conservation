class AddCategoryNtfp < ActiveRecord::Migration
  def self.up
    Category.create(:name=>"Non Timber Forest Produce")
  end

  def self.down
	Category.destroy(:name=>"Non Timber Forest Produce")
  end
end
