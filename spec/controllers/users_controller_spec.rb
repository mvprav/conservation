require 'spec_helper'

describe UsersController do
  integrate_views
  describe "GET 'new'" do
    it "should be successful" do
      get 'new'
      response.should be_success
    end
    it "should have right title" do
      get :new
      response.should have_tag("title",/Sign up/)
    end 
  end

  describe "get 'show' " do
    before(:each) do
      @user=Factory(:user)
      User.stub!(:find,@user.id).and_return(@user)
    end
    it "should be successful" do
      get :show, :id=>@user
      response.should be_success
    end
    it "should have the right title" do
      get :show, :id=>@user
      response.should have_tag("title",/#{@user.name}/)
    end 
  end

  describe "POST 'create'" do
    describe "failure" do
      before(:each) do
        @attr={ 
          :name=>"",:email=>"",:password=>"",:password_confirmation=>""
        }
        @user=Factory.build(:user,@attr)
        User.stub!(:new).and_return(@user) 
        @user.should_receive(:save).and_return(false)
      end

      it "should have right title" do
        post :create, :user=>@attr
        response.should have_tag("title",/Sign up/)
      end 

      it "should render 'new' page" do
        post :create, :user=>@attr
        response.should render_template('new')
      end 
    end
     describe "Success" do
      before(:each) do
        @attr={ 
          :name=>"praveen",:email=>"a@a.com",:password=>"password",:password_confirmation=>"password"
        }
        @user=Factory(:user)
        User.stub!(:new).and_return(@user)
        @user.should_receive(:save).and_return(true)
      end

      it "should redirect to user show page" do
        post :create, :user=>@attr
        response.should redirect_to(user_path(@user))
      end 

      it "should have a welcome message" do
        post :create, :user=>@attr
        flash[:success].should =~/Welcome to conservation site/i
      end 
    end
  end
end

