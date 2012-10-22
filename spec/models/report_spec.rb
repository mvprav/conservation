# == Schema Information
#
# Table name: reports
#
#  id            :integer          not null, primary key
#  title         :string(255)
#  description   :text(255)
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  category_id   :integer
#  location_id   :integer
#  incident_date :date
#  lat           :float
#  lng           :float
#  user_id       :integer
#  video         :string(255)
#  newslink      :string(255)
#  address       :string(255)
#

require 'spec_helper'

describe Report do
  before(:each) do
    @valid_attributes = {
      :title => "value for title",
      :description => "description",
      :incident_date=>Date.today,
      :category=>FactoryGirl.create(:category),
      :location=>FactoryGirl.create(:location),
      :user=>FactoryGirl.create(:user),
      :lat=>'1.23',
      :lng=>'2.34'
    }
  end
 

  describe "associations" do
    before(:each) do
      @report=Report.new(@valid_attributes)
    end

    it "should belong to a category" do
      @report.should respond_to(:category)
    end 

    it "should associate with right category" do
      @category=FactoryGirl.create(:category)
      @report.category=@category
      @report.should be_valid
      @report.category.should==@category
    end 

    it "should belongs to a location" do
      @report.should respond_to(:location)
    end 

    it "should associae with right user" do
      @user=FactoryGirl.create(:user,:email=>"1@1.com")
      @report.user=@user
      @report.user.should==@user
    end 

    it "should associate with right location" do
      @location=FactoryGirl.create(:location)
      @report.location=@location
      @report.should be_valid
      @report.location.should == @location
    end

    it "should respond to incident_images" do
      @report.should respond_to :incident_images
    end 

    it "should belog to a user" do
      @report.should respond_to :user
    end 
  end
  describe "validation" do
    
    it "should not  create report with out title" do
      report_without_title= Report.new(@valid_attributes.merge(:title=>""))
      report_without_title.should_not be_valid
    end

    it "should not create report with out description" do
      report_without_description=Report.new(@valid_attributes.merge(:description=>""))
      report_without_description.should_not be_valid
    end

    it "should not create report with out category" do
      report_without_category=Report.new(@valid_attributes.merge(:category=>nil))
      report_without_category.should_not be_valid
    end 

    it "should not create report with out location" do
      report_without_location=Report.new(@valid_attributes.merge(:location=>nil))
      report_without_location.should_not be_valid
    end 

    it "should not create report without incident date" do
      report_without_date =Report.new(@valid_attributes.merge(:incident_date=>""))
      report_without_date.should_not be_valid
    end 

    it "should not create report without owner" do
      report_without_owner = Report.new(@valid_attributes.merge(:user=>nil))
      report_without_owner.should_not be_valid
    end 
    
    it "should not create report without google map locations" do
      report_without_googlemap_locations = Report.new(@valid_attributes.merge(:lat=>'',:lng=>''))
      report_without_googlemap_locations.should_not be_valid
      report_without_googlemap_locations.errors.size.should == 1 
    end 
  end

  it "should truncate title to length 42 charaters" do
    report_with_title_more_than_42_char = Report.new(@valid_attributes.merge(:title=>'12345678901234567890123456789012345678901234567890'))
    report_with_title_more_than_42_char.title_summary.length.should==42
    report_with_title_more_than_42_char.title_summary.should=="123456789012345678901234567890123456789..."
  end

  it "should not truncate title if length is less than 42 characters " do

    report_with_title_less_than_42_char=Report.new(@valid_attributes.merge(:title=>"abcd"))
    report_with_title_less_than_42_char.title_summary.should=="abcd"
                                                  
  end
end

