'use strict';

module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		// Metadata.
		pkg: grunt.file.readJSON('seajs.json'),
		banner: '/* <%= grunt.template.today("yyyy-mm-dd")%> */\n',
		clean: {
			files: ['dist']
		},
		transport: {
			target: {
				options: {
					paths:['../../public/dist/'],
					alias:{
						'underscore': 'underscore/1.5.2/underscore',
						'plupload': 'plupload/1.5.6/plupload',
						'template': 'arttemplate/2.0.1/arttemplate',
						'bootstrap': 'bootstrap/2.3.2/bootstrap',
						'md5': 'md5/1.0.0/md5',
						'events': 'events/1.1.0/events',
						'validator': 'validator/1.2.0/validator',
					},
					idleading: '<%= pkg.name %>/<%= pkg.version %>/'
				},
				files: [{
					cwd: 'src',
					src: ['**/*.js', '**/*.css'],
					dest: 'dist'
				}]
			}
		},
		concat: {
			options: {
				banner: '<%= banner %>',
				stripBanners: true
			},
			debug: {
				src: [
					'dist/*-debug.js',
					'dist/*/*-debug.js',
				],
				dest: '../../public/dist/<%= pkg.name %>/<%= pkg.version %>/<%= pkg.name %>-debug.js'
			},
			dist: {
				src: [
					'dist/*.js', '!dist/*-debug.js',
					'dist/*/*.js', '!dist/*/*-debug.js',
				],
				dest: 'dist/concat/all.js'
			}
		},
		uglify: {
			options: {
				banner: '<%= banner %>'
			},
			dist: {
				src: '<%= concat.dist.dest %>',
				dest: '../../public/dist/<%= pkg.name %>/<%= pkg.version %>/<%= pkg.name %>.js'
			}
		},
		copy: {
		  main: {
			files: [{
				expand: true,
				cwd: 'src/',
				src: ['**/*.css', '**/*.gif', '**/*.png', '**/*.jpg', '**/*.swf'],
				dest: '../../public/dist/<%= pkg.name %>/<%= pkg.version %>/',
				filter: 'isFile'
			}]
		  }
		},

		// check
		qunit: {
			files: ['test/**/*.html']
		},
		jshint: {
			src: {
				options: {
				  jshintrc: 'src/.jshintrc'
				},
				src: ['src/**/*.js']
			},
			test: {
				options: {
				  jshintrc: 'test/.jshintrc'
				},
				src: ['test/**/*.js']
			}
		},
		watch: {
			gruntfile: {
				files: '<%= jshint.gruntfile.src %>',
				tasks: ['jshint:gruntfile']
			},
			src: {
				files: '<%= jshint.src.src %>',
				tasks: ['jshint:src', 'qunit']
			},
			test: {
				files: '<%= jshint.test.src %>',
				tasks: ['jshint:test', 'qunit']
			}
		}
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-cmd-transport');
	grunt.loadNpmTasks('grunt-contrib-copy');

	// Default task.
	grunt.registerTask('default', ['clean', 'transport', 'concat', 'uglify', 'copy']);
	grunt.registerTask('check', ['jshint', 'qunit']);

};
