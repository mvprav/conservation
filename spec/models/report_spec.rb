require 'spec_helper'

describe Report do
  before(:each) do
    @valid_attributes = {
      :title => "value for title",
      :description => "description",
      :incident_date=>Date.today
    }
  end
 

  describe "associations" do
    before(:each) do
      @report=Report.new(@valid_attributes)
      @report.category=Factory(:category)
      @report.location=Factory(:location)
    end

    it "should belong to a category" do
      @report.should respond_to(:category)
    end 

    it "should associate with right category" do
      @category=Factory(:category)
      @report.category=@category
      @report.should be_valid
      @report.category.should==@category
    end 

    it "should belongs to a location" do
      @report.should respond_to(:location)
    end 

    it "should associate with right location" do
      @location=Factory(:location)
      @report.location=@location
      @report.should be_valid
      @report.location.should == @location
    end

    it "should respond to incident_images" do
      @report.should respond_to :incident_images
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
      report_without_category=Report.new(@valid_attributes)
      report_without_category.location=Factory(:location)
      report_without_category.should_not be_valid
    end 

    it "should not create report with out location" do
      report_without_location=Report.new(@valid_attributes)
      report_without_location.category=Factory(:category)
      report_without_location.should_not be_valid
    end 

    it "should not create report without incident date" do
      report_without_date =Report.new(@valid_attributes.merge(:incident_date=>""))
      report_without_date.category=Factory(:category)
      report_without_date.location=Factory(:location)
      report_without_date.should_not be_valid
    end 
  end
end
