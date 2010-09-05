class HomeController < ApplicationController
  def show
    @reports=Report.find(:all,:limit=>10,:order=>'created_at DESC')
  end

end

