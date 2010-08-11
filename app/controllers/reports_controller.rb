class ReportsController < ApplicationController
  include SessionsHelper
  before_filter :authenticate , :only=>[:new, :create]

  def authenticate
    deny_access unless signed_in?
  end

  def index
    @title="Reports"
    @reports= Report.paginate(:page=>params[:page],:per_page=>10)
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

end
