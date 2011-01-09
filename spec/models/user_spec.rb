require 'spec_helper'
require 'pp'

describe User do
  before(:each) do
    @attr={ 
      :name=>"Example User",
      :email=>"user@example.com",
      :password=>"password",
      :password_confirmation=>"password",
      :firstname=>"firstname",
      :phone_number=>"9741498366",
      :address=>"karthik nagar",
      :city=>"bangalore",
      :state=>"karnataka",
      :postal_code=>"560037",
      :country=>"india"
    }
  end

  it "should create a new instance given valid attributes" do
    User.create!(@attr)
  end
  
  it "should require a name" do
    no_name_user=User.new(@attr.merge(:name=>""))
    no_name_user.should_not be_valid
  end 

  it "should require a email" do
    no_email_user=User.new(@attr.merge(:email=>""))
    no_email_user.should_not be_valid
  end 

  it "should accept valid email addresses" do
    valid_email_addresses = %w[user@foo.com THE_User@foo.bar.org first.last@foo.jp]
    valid_email_addresses.each do |address|
      valid_email_user=User.new(@attr.merge(:email=>address))
      valid_email_user.should be_valid
    end 
  end 

  it "should not accept invalid email" do
    invalid_email_addressed = %w[user@foo,com user_at_foo.org example.user@foo.]
    invalid_email_addressed.each do |address|
      invalid_email_user=User.new(@attr.merge(:email=>address))
      invalid_email_user.should_not be_valid
    end 
  end 
  it "should reject duplicate email address" do
    User.create!(@attr)
    user_with_duplicate_email=User.new(@attr)
    user_with_duplicate_email.should_not be_valid

    user_with_duplicate_email=User.new(@attr.merge(:email=>@attr[:email].upcase))
    user_with_duplicate_email.should_not be_valid
  end 

  it "should require first name" do
    user_without_firstname=User.new(@attr.merge(:firstname=>''))
    user_without_firstname.should_not be_valid
  end

  it "should require phone number" do
     user = User.new(@attr.merge(:phone_number=>''))
    user.should_not be_valid
  end

  it "should not valid if phone number constsist any thing other than digits" do
    user = User.new(@attr.merge(:phone_number=>'12345678asd'))
    user.should_not be_valid
  end

  it "should require phone number of 10 digits" do
    user = User.new(@attr.merge(:phone_number=>'12345678'))
    user.should_not be_valid
  end

  it "should require address" do
    user = User.new(@attr.merge(:address=>nil))
    user.should_not be_valid
  end

  it "should require city" do
    user = User.new(@attr.merge(:city=>nil))
    user.should_not be_valid
  end

  it "should require postal code" do
    user = User.new(@attr.merge(:postal_code=>nil))
    user.should_not be_valid
  end

  it "should require country" do
     user = User.new(@attr.merge(:country=>nil))
    user.should_not be_valid
  end

  describe "password validation" do
    it "should require password" do
      User.new(@attr.merge(:password=>"",:password_confirmation=>"")).
        should_not be_valid
    end 
    
    it "should require a matching confirmation password" do
      User.new(@attr.merge(:password_confirmation=>"invalid")).
        should_not be_valid
    end 

    it "should reject short password" do
      short="a" * 5
      User.new(@attr.merge(:password=>short,:password_confirmation=>short)).
        should_not be_valid
    end 
    
    it "should reject long password" do
      long = "a" * 41
      User.new(@attr.merge(:password=>long,:password_confirmation=>long)).
        should_not be_valid
    end 
  end 

  describe "password encryption" do
    before(:each) do
      @user=User.create!(@attr)
    end 
    it "should have encrypted password attribute" do
      @user.should respond_to(:encrypted_password)
    end 
    
    it "should set encrypted password" do
      @user.encrypted_password.should_not be_blank
    end 
  end 

  describe "has_password? method" do
    before do
      @user=User.create!(@attr)
    end
    it "should be true if password matches" do
      @user.has_password?(@attr[:password]).should be_true
    end 

    it "should be false if password don't match" do
      @user.has_password?("invalid").should be_false
    end 
  end

  describe "authentication" do
    before(:each) do
      @user=User.create!(@attr)
    end
    it "should return nil if email/password mismatch" do
      wrong_password_user=User.authenticate(@attr[:email],"WRONG PASSWORD")
      wrong_password_user.should be_nil
    end 
    it "should return nil for an email address with no user" do
      non_existent_user=User.authenticate("wrong email",@attr[:password])
      non_existent_user.should be_nil
    end  
    it "should return the user when email/password matches" do
      user=User.authenticate(@attr[:email],@attr[:password])
      user.should_not be_nil
    end 
  end

  describe "Remember me" do
    before(:each) do
      @user=User.create!(@attr)
    end

    it "should have a remember me token" do
      @user.should respond_to(:remember_token)
    end 

    it "should have remember me method" do
      @user.should respond_to(:remember_me!)
    end 

    it "should set remember me token" do
      @user.remember_me!
      @user.remember_token.should_not be_nil
    end 
  end

  describe "Roles" do
    it "should not be admin by default" do
      @user= User.new(@attr)
      @user.should_not be_admin
    end 

    it "should be convertable to admin" do
      @user= User.new(@attr)
      @user.toggle!(:admin)
      @user.should be_admin
    end 
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

