require 'spec_helper'
describe FilterCondition do

  it "should generate empty condition hash" do
    @filter=FilterCondition.new
    @condition=@filter.condition
    @condition.should be_empty
  end 

  it "should generate condition for location" do
    @filter=FilterCondition.new({"location_id"=>"1"})
    @condition=@filter.condition
    @condition.length.should==1
    @condition[:location_id].should=="1"
  end 
  
  it "should generate condition for category" do
    @filter=FilterCondition.new({"category_id"=>"1"})
    @condition=@filter.condition
    @condition.length.should==1
    @condition[:category_id].should=="1"
  end 

  it "should generate condition for date_from and date_to" do
    @filter=FilterCondition.new({"date_from"=>'11-10-1983',
                         "date_to"=>'22-10-2010'})
    @condition=@filter.condition
    @condition.length.should==1
    @condition.should=={:incident_date=>Date.parse('11-10-1983')..Date.parse('22-10-2010')}
  end 

  it "should generate filter condition" do
    @filter=FilterCondition.new({"location_id"=>'1',"category_id"=>'1'})
    @condition=@filter.condition
    @condition.length.should==2
    @condition.should=={:location_id=>'1',:category_id=>'1'}
  end 
end
