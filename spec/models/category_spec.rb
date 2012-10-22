# == Schema Information
#
# Table name: categories
#
#  id         :integer          not null, primary key
#  name       :string(255)
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

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
