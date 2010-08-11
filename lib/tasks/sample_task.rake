require 'faker'

namespace :db do
  desc "Fill database with sample data"
  task :populate => :environment do
    Rake::Task['db:reset'].invoke

    @category=Category.create(:name=>"Cattle in Park")
    @location=Location.create(:name=>"Naraghole")
    Report.create!(:title => "sample title",
                 :description=>"some description",
		 :category=>@category,
		 :location=>@location)
    
   

    99.times do |n|
      description = "some description-#{n+1}"
      title="title-#{n+1}"
      Report.create!(:title => title,
                    :description=>description,:category=>@category,
		    :location=>@location)
    end
  end

end
