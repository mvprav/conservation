require 'spec_helper'

describe Category do
  before(:each) do
    @attr = {
      :name=>"some category"
    }
  end

  it "should create a new instance given valid attributes" do
    Category.create!(@attr)
  end

  it "should require name" do
    @category=Category.new(@attr.merge(:name=>""))
    @category.should_not be_valid
  end 
end
