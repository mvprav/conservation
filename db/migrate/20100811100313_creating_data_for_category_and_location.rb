class CreatingDataForCategoryAndLocation < ActiveRecord::Migration
  def self.up
    Category.create(:name=>"Poaching")
    Category.create(:name=>"Fragmentation")
    Category.create(:name=>"Forest Fires")
    Category.create(:name=>"Human-Wildlife Conflict")
    Category.create(:name=>"Livestock Grazing")
    Category.create(:name=>"Mining")
    Category.create(:name=>"NTFP")
    Category.create(:name=>"Road Kills")
    Category.create(:name=>"Timber Smuggling")
    Category.create(:name=>"Excessive Tourism")
    Category.create(:name=>"Others")
    
    Location.create(:name=>"Cauvery Wildlife Sanctuary")
    Location.create(:name=>"BRT Wildlife Sanctuary")
    Location.create(:name=>"Bandipur National Park")
    Location.create(:name=>"Nagarahole National Park")
    Location.create(:name=>"Bramhagiri Wildlife Sanctuary")
    Location.create(:name=>"Talacauvery Wildlife Sanctuary")
    Location.create(:name=>"Pushpagiri Wildlife Sanctuary")
    Location.create(:name=>"Bhadra Wildlife Sanctuary")	
    Location.create(:name=>"Kudremukh National Park")
    Location.create(:name=>"Agumbe Wildlife Sanctuary")
    Location.create(:name=>"Mookambika Wildlife Sanctuary")
    Location.create(:name=>"Shettihalli Wildlife Sanctuary")
    Location.create(:name=>"Sharavathi Wildlife Sanctuary")
    Location.create(:name=>"Dandeli Wildlife Sanctuary")
    Location.create(:name=>"Anshi National Park")
    Location.create(:name=>"Other locations in Western Ghats")
    Location.create(:name=>"Other Important Wildlife Habitats")
  end

  def self.down
  end
end
