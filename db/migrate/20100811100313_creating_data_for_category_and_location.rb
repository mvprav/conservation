class CreatingDataForCategoryAndLocation < ActiveRecord::Migration
  def self.up
           Category.create(:name=>"Cattle in Parks")
       Category.create(:name=>"Poaching")
       Category.create(:name=>"Wildlife Poisoning")
       Category.create(:name=>"Illegal Activities")
       Category.create(:name=>"Wildlife Trade")
       Category.create(:name=>"Illegal Activities")
       Category.create(:name=>"Road Kills")
       Category.create(:name=>"Fire in Parks")
       Category.create(:name=>"Bush Meat")
       Category.create(:name=>"Mining in Parks")
       Category.create(:name=>"Others")

       Location.create(:name=>"Nagarhole")
       Location.create(:name=>"Bandipur")
       Location.create(:name=>"Bhadra")
       Location.create(:name=>"Kudremukh")
       Location.create(:name=>"Anshi Dandelli")
       Location.create(:name=>"BR Hills")
       Location.create(:name=>"Cauvery WS")
       Location.create(:name=>"Bannerghatta")	
       Location.create(:name=>"Dharoji")
       Location.create(:name=>"Ranganthitu")
       Location.create(:name=>"Others")
  end

  def self.down
  end
end
