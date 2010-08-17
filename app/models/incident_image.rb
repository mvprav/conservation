class IncidentImage < ActiveRecord::Base
  has_attached_file :image
  validates_attachment_presence :image
  belongs_to :report
  validates_presence_of :report
end
