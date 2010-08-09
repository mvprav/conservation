class ReportsController < ApplicationController
  include SessionsHelper
  before_filter :authenticate , :only=>[:new, :create]

  def authenticate
    deny_access unless signed_in?
  end

  def index
    @title="Reports"
    @reports= Report.find(:all)
  end

  def new
    @title="Report Incident"
    @report=Report.new()
  end

  def create
    @report=Report.new(params[:report])
    @title="Report Incident"
    if @report.save
      redirect_to @report
      flash[:success]="Incident Reported"
    else
      render :new
    end
  end

  def show
    @report=Report.find(params[:id])
    @title=@report.title
  end

end
