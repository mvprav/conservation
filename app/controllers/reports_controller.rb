require 'filter_condition'
require 'pp'
class ReportsController < ApplicationController
  include SessionsHelper
  before_filter :authenticate , :only=>[:new, :create]
  
  def authenticate
    deny_access unless signed_in?
  end

  def index
    @locations=Location.find(:all)
    @categories=Category.find(:all)
    @title="Reports"
    @filter=FilterCondition.new(params[:filtercondition]||={})
    @reports= Report.paginate(:page=>params[:page],:per_page=>10,:conditions=>@filter.condition,:order=>'created_at DESC')
  end

  def new
    @title="Report Incident"
    @report=Report.new()
    @categories=Category.find(:all)
    @locations=Location.find(:all)
  end
  
  def create
    @report=Report.new(params[:report])
    @report.category=Category.find(params[:report][:category_id])
    @report.location=Location.find(params[:report][:location_id])
    @title="Report Incident"
    
    if @report.save
      if params[:photos] != nil 
        params[:photos].each do |key,photo|
          @image=IncidentImage.new(:image=>photo,:report=>@report)
          @image.save
        end
      end
      redirect_to @report
      flash[:success]="Incident Reported"
    else
      @categories=Category.find(:all)
      @locations=Location.find(:all)
      render :new
    end
  end

  def show
    @report=Report.find(params[:id])
    @title=@report.title
  end
  def reports_json
    @filter=FilterCondition.new(params[:filtercondition]||={})
    render :json =>Report.find(:all,:conditions=>@filter.condition).to_json(:only=>[:id,:lat,:lng])
  end
end
