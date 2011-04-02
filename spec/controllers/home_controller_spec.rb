require 'spec_helper'

describe HomeController do

  it "should retrive top 10 reports" do
    @reports_returned=[Factory(:report),Factory(:report,:title=>"second report")]
    Report.should_receive(:find).with(:all,:order=>"created_at DESC",:limit=>10).and_return(@reports_returned)
    get :show
    assigns[:reports].should==@reports_returned
  end 
  
end
