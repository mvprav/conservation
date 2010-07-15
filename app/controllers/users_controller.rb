class UsersController < ApplicationController
  include SessionsHelper
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
    @user=User.find(params[:id])
  end

  def update
    @user=User.find(params[:id])
    if @user.update_attributes(params[:user])
      flash[:success] = 'Updated'
      redirect_to @user
    else
      @title="Edit User"
      render :edit
    end
  end
end
