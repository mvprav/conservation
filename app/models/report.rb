# == Schema Information
#
# Table name: reports
#
#  id            :integer          not null, primary key
#  title         :string(255)
#  description   :text(255)
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  category_id   :integer
#  location_id   :integer
#  incident_date :date
#  lat           :float
#  lng           :float
#  user_id       :integer
#  video         :string(255)
#  newslink      :string(255)
#  address       :string(255)
#

class Report < ActiveRecord::Base
  validates_presence_of :title
  validates_presence_of :description 
  validates_presence_of :category
  validates_presence_of :location
  #validates_presence_of :incident_date
  validates :incident_date, :uniqueness => true
  validates_presence_of :user

  reverse_geocoded_by :lat, :lng
  after_validation :reverse_geocode  # auto-fetch address

  validate :lat, :lng do |record|
    record.errors[:base] = 'Please specify location in the map and attach the picture again incase added.' if record.lat.blank? || record.lng.blank?
  end
  belongs_to :user
  belongs_to :category
  belongs_to :location
  has_many :incident_images

  def title_summary
    title.shorten
  end

end

class String
  def shorten (count = 42)
    string=to_s()
    if string.length >= count 
      shortened = string[0, count-3]
      shortened.concat('...')
    else 
      string
    end
  end

end


