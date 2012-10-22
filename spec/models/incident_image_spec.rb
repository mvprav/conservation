# == Schema Information
#
# Table name: incident_images
#
#  id                 :integer          not null, primary key
#  image_file_name    :string(255)
#  image_content_type :string(255)
#  photo_file_size    :integer
#  image_updated_at   :datetime
#  report_id          :integer
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  images_file        :binary
#

require 'spec_helper'
describe IncidentImage do
  before(:each) do
    @attr={
      :image=>File.new("#{Rails.root}/spec/fixtures/images/button.png"),
      :report=>FactoryGirl.create(:report)
      
    }
  end

  it "should be valid for right attributes" do
    @incident_image=IncidentImage.new(@attr)
    @incident_image.should be_valid
  end 

  it "should respond to image attribute" do
    @incident_image=IncidentImage.new(@attr)
    @incident_image.should respond_to :image
  end 
  describe "validation" do
    it "should not be valid with out a image" do
      @incident_image=IncidentImage.new()
      @incident_image.should_not be_valid
    end 

    it "should not be valid with out report" do
      @incident_image=IncidentImage.new(@attr.merge(:report=>nil))
      @incident_image.should_not be_valid
    end 
  end

  describe "association" do
    it "should respond to report" do
      @incident_image=IncidentImage.new(@attr)
      @incident_image.should respond_to :report
    end

    it "should have right association" do
      @report=FactoryGirl.create(:report)
      @incident_image=@report.incident_images.new(@attr.merge(:report=>nil))
      @incident_image.report.should == @report
      @incident_image.report.id.should == @report.id
    end 
  end
end
