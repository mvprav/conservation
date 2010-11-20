require 'pp'
class Report < ActiveRecord::Base
  validates_presence_of :title
  validates_presence_of :description 
  validates_presence_of :category
  validates_presence_of :location
  validates_presence_of :incident_date
  validates_presence_of :user
  validates_presence_of :lat,:message=>"Please specify the location in the map."
  validates_presence_of :lng,:message=>"Please specify the location in the map."
  belongs_to :user
  belongs_to :category
  belongs_to :location
  has_many :incident_images

  def title_summary
    title.shorten
  end
end


class String
  def shorten (count = 30)
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

