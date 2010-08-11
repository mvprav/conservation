class Report < ActiveRecord::Base
  validates_presence_of :title
  validates_presence_of :description 
  validates_presence_of :category
  validates_presence_of :location
  validates_presence_of :incident_date
  belongs_to :category
  belongs_to :location
end

