class UnderstandthreatsController < ApplicationController

  def page
      @page_to_render='index'
    unless params[:page].nil?
      @page_to_render=params[:page]
    end
    
    pp @page_to_render
    render  @page_to_render
  end
end
