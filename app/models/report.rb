require 'pp'
class Report < ActiveRecord::Base
  validates_presence_of :title
  validates_presence_of :description 
  validates_presence_of :category
  validates_presence_of :location
  validates_presence_of :incident_date
  validates_presence_of :user
  belongs_to :user
  belongs_to :category
  belongs_to :location
  has_many :incident_images

  def title_summary
    title.shorten
  end

  def validate
       errors.add_to_base "Please specify location in the map and attach the picture again incase added." if lat.blank? and lng.blank?
  end

end


class String
  def shorten (count = 42)
    string=to_s()
    pp string
    if string.length >= count 
      shortened = string[0, count-3]
      shortened.concat('...')
    else 
      string
    end
  end
  
end


# == Schema Information
#
# Table name: reports
#
#  id            :integer         not null, primary key
#  title         :string(255)
#  description   :string(255)
#  created_at    :datetime
#  updated_at    :datetime
#  category_id   :integer
#  location_id   :integer
#  incident_date :date
#  lat           :float
#  lng           :float
#  user_id       :integer
#

