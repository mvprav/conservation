class SessionsController < ApplicationController
include SessionsHelper
   def new
    @title="Sign in"
  end

  def create
    user=User.authenticate(params[:session][:email],
                           params[:session][:password])
    if user.nil?
      flash.now[:error] = 'Invalid email/password combination'
      @title="Sign in"
      render :new
    else
      sign_in user
      redirect_to new_report_path
    end
  end
  
  def destroy
    sign_out
    redirect_to home_path
  end

end
