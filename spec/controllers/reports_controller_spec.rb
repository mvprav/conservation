require 'spec_helper'

describe ReportsController do
  integrate_views
  describe "Report creation get :new" do
    before(:each) do
      @user=Factory(:user)
      test_sign_in @user
    end

    it "should provide facility to enter report details" do
      get :new 
      response.should be_success
    end

    it "should provide right title" do
      get :new 
      response.should have_tag("title",/Report Incident/)
    end
  end

  describe "Report POST 'create'" do
    before(:each) do
      @user=Factory(:user)
      test_sign_in @user
    end

    describe "failure" do
      before(:each) do
        @attr={
          :title=>"",
          :description=>""
        }
      end

      it "should have right title" do
        post :create, :report=>@attr
        response.should have_tag("title",/Report Incident/)
      end 

      it "should render 'new' page" do
        post :create, :report=>@attr
        response.should render_template('new')
      end 
    end
    describe "Success" do
      before(:each) do
        @attr={
          :title=>"some title",
          :description=>"some description"
        }
        @report=Factory(:report)
        Report.stub!(:new).and_return(@report)
        @report.should_receive(:save).and_return(true)
      end

      it "should redirect to report show page" do
        post :create, :report=>@report
        response.should redirect_to(report_path(@report))
      end 

      it "should show success message" do
        post :create, :report=>@report
        flash[:success].should =~/Incident Reported/i
      end
    end
  end

  describe "Report GET 'show'" do
    before(:each)do
      @attr={
        :title=>"some title",
        :description=>"some description"
      }

      @report=Factory(:report)
      Report.stub!(:find,@report.id).and_return(@report)
      @user=Factory(:user)
      test_sign_in @user
    end

    it "should be successfull" do
      get :show, :id=>1
      response.should be_success
    end

    it "should have right title" do
      get :show, :id=>1
      response.should have_tag("title",/#{@report.title}/)
    end
  end

  describe "Authentication" do
    describe "for non-signed in user" do
      
      it "should deny access to :new" do
        get :new
        response.should redirect_to(signin_path)
      end 

      it "should deny access to :create" do
        post :create
        response.should redirect_to signin_path
      end 
    end
  end

  describe "Reports GET All" do
    it "should be successful" do
      get :index
      response.should be_success
    end 

    it "should have right title" do
      get :index
      response.should have_tag("title",/Reports/i)
    end 

    it "should load reports" do
      @reports_returned=[Factory(:report),Factory(:report,:title=>"some title")]
      Report.should_receive(:find).with(:all).and_return(@reports_returned)
      get :index
      assigns(:reports).should == @reports_returned
    end
  end
end

