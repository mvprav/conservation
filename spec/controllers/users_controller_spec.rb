require 'spec_helper'

describe UsersController do
  render_views

  describe "GET 'new'" do
    it "should be successful" do
      get 'new'
      response.should be_success
    end
    it "should have right title" do
      get :new
      response.should have_title("title",/Sign up/)
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
      response.should have_selector("title",/#{@user.name}/)
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
        response.should have_selector("title",/Sign up/)
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
        flash[:success].should =~/Welcome to Conservation Threats site/i
      end 

      it "should sign the user in" do
        post :create, :user=>@attr
        controller.should be_signed_in
      end 
    end
  end

  describe "GET 'edit'" do
    before(:each) do
      @user=Factory(:user)
      test_sign_in @user
    end

    it "should be successful" do
      get :edit, :id=>@user
      response.should be_success
    end 

    it "should have right title" do
      get :edit, :id=>@user
      response.should have_selector("title",/edit user/i)
    end 
  end

  describe "PUT 'edit'" do
    before(:each) do
      @user=Factory(:user)
      test_sign_in @user
      User.should_receive(:find).with(@user).and_return(@user)
    end
    describe "failure" do
      before(:each) do
        @invalid_attr={:name=>"",:email=>"" }
        @user.should_receive(:update_attributes).and_return(false)
      end
      
      it "should render edit page" do
        put :update , :id=>@user,:user=>{ }
        response.should render_template(:edit)
      end 

      it "should have right title" do
        put :update , :id=>@user,:user=>{ }
        response.should have_selector("title",/Edit user/i)
      end 
    end
    describe "Success" do
      before(:each) do
        @attr={
          :name=>"new name",:email=>"new@example.com",
          :password=>"something",:password_confirmation=>"something"
        }
        @user.should_receive(:update_attributes).and_return(true)
      end

      it "should redirect to user show page" do
        put :update , :id=>@user,:user=>@attr
        response.should redirect_to(user_path(@user))
      end 

      it "should have a flash message" do
        put :update , :id=>@user,:user=>@attr
        flash[:success] = 'Updated'
      end 
    end
  end
  describe "authentication of user edit/update pages" do
    before(:each) do
      @user=Factory(:user)
    end
    describe "for non-signed in user" do
      it "should deny access to 'Edit'" do
        get :edit, :id=>@user
        response.should redirect_to(signin_path)
      end 

      it "should deny access to update" do
        get :update,:id=>@user
        response.should redirect_to(signin_path)
      end 
    end
    describe "signed in user" do
      before(:each) do
        wrong_user=Factory(:user,:email=>"wrong@user.com")
        test_sign_in wrong_user
      end

      it "should require matching user for 'Edit'" do
        get :edit,:id=>@user
        response.should redirect_to(home_path)
      end 
      
      it "should require match user for update" do
        put :update , :id=>@user,:user=>{ }
        response.should redirect_to(home_path)
      end 
    end
  end
end
