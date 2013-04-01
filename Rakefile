require 'bundler'

Bundler.setup

require 'uglifier'

desc "Compile"
task :compile do
  Dir.glob("**/*.coffee").each do |file|
    system("bundle exec coffee -c #{file}")
  end

  Dir.glob("**/*.scss").each do |file|
    css_name = file.sub(/\.scss/, ".css")
    system("bundle exec sass --scss #{file} > #{css_name}")
  end

  File.open('chardinjs.min.js', 'w') { |f| f.write Uglifier.compile(File.read('chardinjs.js')) }
end

desc "Watch"
task :watch do
  files = Dir.glob("**/*.coffee").join(' ')
  system("bundle exec coffee -wc #{files}")
end
