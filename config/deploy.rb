require File.dirname(__FILE__) + "/capistrano_database_yml"

set :application, "conservation"
set :user, "conserva"
set :server, "74.63.4.11"

set :repository,  "git://github.com/mvprav/conservation.git"
set :scm, :git
set :scn_verbose, true
set :deploy_via, :remote_cache
set :branch, "master"
#set :use_sudo, false

set :keep_releases, 5
set :deploy_to, "/home/#{user}/#{application}" 

role :web, server                           # Your HTTP server, Apache/etc
role :app, server                           # This may be the same as your `Web` server
role :db, server , :primary => true # This is where Rails migrations will run

namespace :deploy do
    [:start, :stop].each do |t|
         desc "#{t} task is a no-op with mod_rails"
         task t, :roles => :app do ; end
    end

    desc "Restarting mod_rails with restart.txt"
    task :restart, :roles => :app, :except => { :no_release => true } do
        run "touch /home/#{user}/#{application}/current/tmp/restart.txt"
    end
end

after "deploy:update_code", :roles => [:web, :db, :app] do
    run "chmod 755 #{release_path}/public -R" 
end

after "deploy:update", "deploy:cleanup" 
end

# namespace :deploy do
#   task :start do ; end
#   task :stop do ; end
#   task :restart, :roles => :app, :except => { :no_release => true } do
#     run "#{try_sudo} touch #{File.join(current_path,'tmp','restart.txt')}"
#   end
# end
