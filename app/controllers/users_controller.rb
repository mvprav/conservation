class UsersController < ApplicationController
  include SessionsHelper
  before_filter :authenticate ,:only=>[:edit,:update]
  before_filter :correct_user , :only=>[:edit,:update]

  def authenticate
    deny_access unless signed_in?
  end

  def correct_user 
    @user=User.find(params[:id])
    redirect_to(home_path) unless current_user==@user
  end

  def new
    @user=User.new
    @title="Sign up"
  end
  
  def show
    @user=User.find(params[:id])
    @title=@user.name
  end 
  
  def create 
    @user = User.new(params[:user]) 
    if @user.save 
      sign_in @user
      flash[:success]="Welcome to conservation site"
      redirect_to @user
    else 
      @title = "Sign up" 
      render 'new' 
    end 
  end 

  def edit
    @title="Edit User"
  end

  def update
    if @user.update_attributes(params[:user])
      flash[:success] = 'Updated'
      redirect_to @user
    else
      @title="Edit User"
      render :edit
    end
  end
end
