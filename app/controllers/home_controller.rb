class HomeController < ApplicationController
  def show
    @reports=Report.find(:all,:limit=>10)
  end

end

