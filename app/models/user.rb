require 'digest'

class User < ActiveRecord::Base
  attr_accessor :password
  attr_accessible :name, :email, :password, :password_confirmation, :firstname
  attr_accessible :phone_number,:address,:city,:postal_code,:country
  EmailRegex = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
  validates_presence_of :name, :email,:password,:firstname,:address,:city
  validates_presence_of :postal_code,:country
  validates_format_of :email, :with => EmailRegex
  validates_uniqueness_of :email , :case_sensitive=>false
  validates_confirmation_of :password
  validates_length_of :password, :within=>6..40
  validates_format_of :phone_number, :with => /^[0-9]{10}$/

  before_save :encrypt_password

  def has_password?(submitted_password)
    unless submitted_password.nil?
      self.encrypted_password==secure_hash(submitted_password)
    end
  end 
  
  def remember_me!
    self.remember_token=secure_hash("#{id}--#{Time.now.utc}")
    save(:validate => false)
  end

  def self.authenticate(email,submitted_password)
    user=find_by_email(email)
    return nil if user.nil?
    return user if user.has_password?(submitted_password)
  end


  private 
  def encrypt_password
    unless password.nil?
      self.encrypted_password=secure_hash(password)
    end
  end
  def secure_hash(string)
    Digest::SHA2.hexdigest(string)
  end

end



# == Schema Information
#
# Table name: users
#
#  id                 :integer         not null, primary key
#  name               :string(255)
#  email              :string(255)
#  created_at         :datetime
#  updated_at         :datetime
#  encrypted_password :string(255)
#  remember_token     :string(255)
#  admin              :boolean
#

