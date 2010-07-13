require 'spec_helper'

describe SessionsController do
  integrate_views

  #Delete these examples and add some real ones
  it "should use SessionsController" do
    controller.should be_an_instance_of(SessionsController)
  end


  describe "GET 'new'" do
    it "should be successful" do
      get 'new'
      response.should be_success
    end
    it "should have the right title" do
      get 'new'
      puts response
      response.should have_tag("title",/sign in/i)
    end 
  end
  
  describe "Post 'create'" do
    describe "Failure" do
      before(:each) do
        @attr={ 
          :email=>"",:password=>""
        }
        User.should_receive(:authenticate).with(@attr[:email],@attr[:password]).
          and_return(nil)
      end

      it "should re render new page" do
        post :create ,:session =>@attr
        response.should render_template(:new)
      end

      it "should have right title" do
        post :create ,:session =>@attr
        response.should have_tag("title",/Sign in/i)
      end 
    end
    
    describe "with valid email and password" do
      before(:each) do
        @user =Factory(:user)
        @attr={ 
          :email=>@user.email,:password=>@user.password
        }
        User.should_receive(:authenticate).with(@user.email,@user.password).
          and_return(@user)
      end

      it "should sign the user in" do
        post :create ,:session =>@attr
        controller.current_user.should==@user
        controller.should be_signed_in
      end 

      it "should redirect to user show page" do
        post :create ,:session =>@attr
        response.should redirect_to(user_path(@user))
      end 
    end
  end

  describe "Delete 'destroy'" do
    it "should sign a user out" do
      test_sign_in(Factory(:user))
      controller.should be_signed_in
      delete :destroy
      controller.should_not be_signed_in
      response.should redirect_to(home_path)
    end 
  end
end
