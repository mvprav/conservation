# == Schema Information
#
# Table name: locations
#
#  id         :integer          not null, primary key
#  name       :string(255)
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

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
