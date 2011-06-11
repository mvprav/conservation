# -*- encoding: utf-8 -*-

Gem::Specification.new do |s|
  s.name = %q{execjs}
  s.version = "1.1.2"

  s.required_rubygems_version = Gem::Requirement.new(">= 0") if s.respond_to? :required_rubygems_version=
  s.authors = ["Sam Stephenson", "Josh Peek"]
  s.date = %q{2011-06-08}
  s.description = %q{    ExecJS lets you run JavaScript code from Ruby.
}
  s.email = ["sstephenson@gmail.com", "josh@joshpeek.com"]
  s.files = ["lib/execjs.rb", "lib/execjs/external_runtime.rb", "lib/execjs/module.rb", "lib/execjs/mustang_runtime.rb", "lib/execjs/ruby_racer_runtime.rb", "lib/execjs/ruby_rhino_runtime.rb", "lib/execjs/runtimes.rb", "lib/execjs/support/basic_runner.js", "lib/execjs/support/jscript_runner.js", "lib/execjs/support/json2.js", "lib/execjs/support/node_runner.js", "lib/execjs/support/which.bat", "LICENSE", "README.md"]
  s.homepage = %q{https://github.com/sstephenson/execjs}
  s.require_paths = ["lib"]
  s.rubyforge_project = %q{execjs}
  s.rubygems_version = %q{1.3.7}
  s.summary = %q{Run JavaScript code from Ruby}

  if s.respond_to? :specification_version then
    current_version = Gem::Specification::CURRENT_SPECIFICATION_VERSION
    s.specification_version = 3

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_runtime_dependency(%q<multi_json>, ["~> 1.0"])
      s.add_development_dependency(%q<rake>, [">= 0"])
    else
      s.add_dependency(%q<multi_json>, ["~> 1.0"])
      s.add_dependency(%q<rake>, [">= 0"])
    end
  else
    s.add_dependency(%q<multi_json>, ["~> 1.0"])
    s.add_dependency(%q<rake>, [">= 0"])
  end
end
