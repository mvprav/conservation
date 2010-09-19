class Location < ActiveRecord::Base
  validates_presence_of :name
end

# == Schema Information
#
# Table name: locations
#
#  id         :integer         not null, primary key
#  name       :string(255)
#  created_at :datetime
#  updated_at :datetime
#

