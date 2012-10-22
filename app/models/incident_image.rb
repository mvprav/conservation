# == Schema Information
#
# Table name: incident_images
#
#  id                 :integer          not null, primary key
#  image_file_name    :string(255)
#  image_content_type :string(255)
#  photo_file_size    :integer
#  image_updated_at   :datetime
#  report_id          :integer
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  images_file        :binary
#

class IncidentImage < ActiveRecord::Base
  has_attached_file :image
  validates_attachment_presence :image
  belongs_to :report
  validates_presence_of :report
end
