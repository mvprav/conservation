require 'spec_helper'
describe "Layout links" do
  it "should have home page at '/home'" do
    get '/'
    #response.should render_template('Home/show')
  end 
end

