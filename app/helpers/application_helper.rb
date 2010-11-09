# Methods added to this helper will be available to all templates in the application.
module ApplicationHelper
  def title 
    base_title = "Conservation Threats" 
    if @title.nil? 
      base_title 
    else 
      "#{base_title} | #{h(@title)}" 
    end 
  end 
end
