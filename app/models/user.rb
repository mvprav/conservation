require 'digest'

class User < ActiveRecord::Base
  attr_accessor :password
  attr_accessible :name, :email, :password, :password_confirmation
  EmailRegex = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
  validates_presence_of :name, :email,:password
  validates_format_of :email, :with => EmailRegex
  validates_uniqueness_of :email , :case_sensitive=>false
  validates_confirmation_of :password
  validates_length_of :password, :within=>6..40

  before_save :encrypt_password

  def has_password?(submitted_password)
    unless submitted_password.nil?
      self.encrypted_password==submitted_password
    end
  end 
  
  def remember_me!
    self.remember_token=secure_hash("#{id}--#{Time.now.utc}")
    save_without_validation
  end

  def self.authenticate(email,submitted_password)
    user=find_by_email(email)
    return nil if user.nil?
    return user if user.has_password?(submitted_password)
  end


  private 
  def encrypt_password
    unless password.nil?
      self.encrypted_password=password
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
#

