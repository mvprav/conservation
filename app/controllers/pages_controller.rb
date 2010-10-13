class PagesController < ApplicationController
  def show
    @page_to_render='unknown'
    unless params[:name].nil?
      @page_to_render=params[:name]
    end
    render  @page_to_render
  end
  
end
