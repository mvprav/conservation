require 'spec_helper'

describe Location do
  before(:each) do
    @valid_attributes = {
      :name => "value for name"
    }
  end

  it "should create a new instance given valid attributes" do
    Location.create!(@valid_attributes)
  end

  it "should require name" do
    @location=Location.new(@valid_attributes.merge(:name=>""))
    @location.should_not be_valid
  end 
end
