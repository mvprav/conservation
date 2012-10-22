require 'spec_helper'
require 'pp'

describe ReportsController do
  render_views
  describe "Report creation get :new" do
    before(:each) do
      controller.request.host="www.dummy.com"
      @user=FactoryGirl.create(:user)
      test_sign_in @user
      @categories_returned=[FactoryGirl.create(:category),FactoryGirl.create(:category,:name=>"name 2")]
      Category.should_receive(:find).with(:all).and_return(@categories_returned)
      @locations_returned=[FactoryGirl.create(:location),FactoryGirl.create(:location,:name=>"location 2")]
      Location.should_receive(:find).with(:all).and_return(@locations_returned)
    end

    it "should provide facility to enter report details" do
      get :new 
      response.should be_success
    end

    it "should provide right title" do
      get :new 
      response.should have_selector("title", :content => 'Report Incident')
    end

    describe "Refrence data" do
      
      it "should provide all categories" do      
        get :new 
        assigns[:categories].should==@categories_returned
      end

      it "should provide all locations" do      
        get :new
        assigns[:locations].should==@locations_returned
      end 
    end
  end

  describe "Report POST 'create'" do
    before(:each) do
      @user=FactoryGirl.create(:user)
      test_sign_in @user
    end

    describe "failure" do
      before(:each) do
        @attr={
          :title=>"",
          :description=>"",
          :category_id=>1,
          :location_id=>1
        }
        @categories_returned=[FactoryGirl.create(:category),FactoryGirl.create(:category,:name=>"name 2")]
        Category.stub!(:find).with(:all).and_return(@categories_returned)
        Category.stub!(:find).with(1).and_return(FactoryGirl.create(:category))
        @locations_returned=[FactoryGirl.create(:location),FactoryGirl.create(:location,:name=>"location 2")]
        Location.stub!(:find).with(:all).and_return(@locations_returned)
        Location.stub!(:find).with(1).and_return(FactoryGirl.create(:location))
      end

      it "should have right title" do
        post :create, :report=>@attr
        response.should have_selector("title", :content => "Report Incident")
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
          :description=>"some description",
          :category_id=>1,
          :location_id=>1
        }
        @category=FactoryGirl.create(:category)
        @location=FactoryGirl.create(:location)
        @report=FactoryGirl.create(:report,:category=>@category,:location=>@location)
        @report.should_receive(:save).and_return(true)

        Report.stub!(:new).and_return(@report)
        Category.should_receive(:find).with("1").and_return(@category)
        Location.should_receive(:find).with("1").and_return(@location)
      end

      it "should redirect to report show page" do
        post :create, :report=>@attr
        response.should redirect_to(report_path(@report))
      end 

      it "should show success message" do
        post :create, :report=>@attr
        flash[:success].should =~/Incident Reported/i
      end

      it "should save photos uploaded along with report" do
        post :create, :report=>@attr,:photos=>{
          "photo_0" => File.new("#{Rails.root}/spec/fixtures/images/button.png"),
          "photo_1"=>File.new("#{Rails.root}/spec/fixtures/images/button.png")
        }
        @report.incident_images.length.should == 2
      end 

      it "should assign the current user as owner" do
        post :create, :report=>@attr
        @report.user.should==@user
      end 
    end
  end

  describe "Report GET 'show'" do
    before(:each)do
      @attr={
        :title=>"some title",
        :description=>"some description"
      }

      @report=FactoryGirl.create(:report,:category=>FactoryGirl.create(:category),:location=>FactoryGirl.create(:location))
      Report.stub!(:find,@report.id).and_return(@report)
      @user=FactoryGirl.create(:user)
      test_sign_in @user
    end

    it "should be successfull" do
      get :show, :id=>1
      response.should be_success
    end

    it "should have right title" do
      get :show, :id=>1
      response.should have_selector("title", :content => "#{@report.title}")
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
    before(:each) do
      @category=FactoryGirl.create(:category)
      @location=FactoryGirl.create(:location)
      @reports_returned=[FactoryGirl.create(:report,:category=>@category,:location=>@location),
                         FactoryGirl.create(:report,:title=>"some title",:category=>@category,:location=>@location)]
      30.times do
        @reports_returned << FactoryGirl.create(:report,:category=>@category,:location=>@location)
      end
      Report.should_receive(:paginate).and_return(@reports_returned.paginate)
    end
    it "should be successful" do
      get :index
      response.should be_success
    end 

    it "should have right title" do
      get :index
      response.should have_selector("title", :content => "Reports")
    end 

    it "should load reports" do  
      get :index
      response.should have_selector("div.pagination")
      response.should have_selector("span", "&laquo; Previous")
      response.should have_selector("span", "1")
      response.should have_selector("a[href=?]", "/reports?&amp;page=2", "2")
      response.should have_selector("a[href=?]", "/reports?&amp;page=2", "Next &raquo;")
    end
  end

  describe "Reports GET JSON" do
    before(:each) do
      @category=FactoryGirl.create(:category)
      @location=FactoryGirl.create(:location)
      @reports_returned=[FactoryGirl.create(:report,:category=>@category,:location=>@location),
                         FactoryGirl.create(:report,:title=>"some title",:category=>@category,:location=>@location)]
      2.times do
        @reports_returned << FactoryGirl.create(:report,:category=>@category,:location=>@location)
      end
    end

    it "should return all reports in json format" do
      get :reports_json
      pp response.body
      response.body.should==@reports_returned.to_json(:only=>[:id,:lat,:lng,:title,:name],
              :include=>[:category,:location])
    end 
  end

  describe "Filtering of report" do
     before(:each) do
      @category=FactoryGirl.create(:category)
      @location=FactoryGirl.create(:location)
      @reports_returned=[FactoryGirl.create(:report,:category=>@category,:location=>@location),
                         FactoryGirl.create(:report,:title=>"some title",:category=>@category,:location=>@location)]
      2.times do
        @reports_returned << FactoryGirl.create(:report,:category=>@category,:location=>@location)
      end
    end
    
    it "should filter based on location" do
      Report.should_receive(:paginate).with(:order=>"created_at DESC",:page=>nil, :per_page=>10,:conditions=>{:location_id=>"1"}).
        and_return(@reports_returned.paginate)
      get :index, :filtercondition=>{:location_id=>'1'}
      response.should be_success
    end 

    it "should filter based on category" do
      Report.should_receive(:paginate).with(:order=>"created_at DESC",:page=>nil, :per_page=>10,:conditions=>{:category_id=>"1"}).
        and_return(@reports_returned.paginate)
      get :index, :filtercondition=>{:category_id=>'1'}
      response.should be_success
    end 
  end

  describe "Deleting of reports " do
    describe "For unauthenticated user" do
      it "should redirect to signing page" do
        delete :destroy, :id=>'1'
        response.should redirect_to signin_path
      end 
    end
    
    describe "For Authenticated user" do
      describe "For user not the owner of the report" do
        before(:each) do
          @wrong_user=FactoryGirl.create(:user,:email=>"wrong_user@abc.com")
          test_sign_in @wrong_user
        end
        
        it "should render report show page with error message" do
          @report=FactoryGirl.create(:report)
          Report.stub!(:find,@report.id).and_return(@report)
          delete :destroy , :id=>@report
          response.should redirect_to report_path
          flash[:notice].should=="Access denied"
        end 
      end
      
      describe "For the owner of the report " do
        before(:each) do
          @user=FactoryGirl.create(:user)
          test_sign_in @user
        end
        
        it "should delete the report" do
          @report=FactoryGirl.create(:report,:user=>@user)
          Report.stub!(:find,@report.id).and_return(@report)
          @report.should_receive(:delete)
          delete :destroy , :id=>@report
          response.should redirect_to home_path
        end 
      end

      describe "For admin user" do
         before(:each) do
          @user=FactoryGirl.create(:user)
          test_sign_in @user
        end
        
        it "should delete the report" do
          @user.toggle!(:admin)
          @report=FactoryGirl.create(:report)
          Report.stub!(:find,@report.id).and_return(@report)
          @report.should_receive(:delete)
          delete :destroy , :id=>@report
          response.should redirect_to home_path
        end 

      end
    end
  end
end

