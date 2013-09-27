/*
 * grunt-init-jquery
 * https://gruntjs.com/
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman, contributors
 * Licensed under the MIT license.
 
// spm build
// �޸��޸�����ļ�
// C:\Users\panxuepeng\AppData\Roaming\npm\node_modules\grunt-init\tasks
// �����������е���Լ430�д�
		if (props.root) { pkg.root = props.root; }
		if (props.output) { pkg.output = props.output; }
		if (props.spmConfig) { pkg.spmConfig = props.spmConfig; }
 */

'use strict';

// Basic template description.
exports.description = 'Create a jQuery plugin, including QUnit unit tests.';

// Template-specific notes to be displayed before question prompts.
exports.notes = '_Project name_ should not contain "jquery" or "js" and ' +
  'should be a unique ID not already in use at plugins.jquery.com. _Project ' +
  'title_ should be a human-readable title, and doesn\'t need to contain ' +
  'the word "jQuery", although it may. For example, a plugin titled "Awesome ' +
  'Plugin" might have the name "awesome-plugin".' +
  '\n\n'+
  'For more information, please see the following documentation:' +
  '\n\n'+
  'Naming Your Plugin      http://plugins.jquery.com/docs/names/\n' +
  'Publishing Your Plugin  http://plugins.jquery.com/docs/publish/\n' +
  'Package Manifest        http://plugins.jquery.com/docs/package-manifest/';

// Template-specific notes to be displayed after question prompts.
exports.after = 'You should now install project dependencies with _npm ' +
  'install_. After that, you may execute project tasks with _grunt_. For ' +
  'more information about installing and configuring Grunt, please see ' +
  'the Getting Started guide:' +
  '\n\n' +
  'http://gruntjs.com/getting-started';

// Any existing file or directory matching this wildcard will cause a warning.
exports.warnOn = '*';

// The actual init template.
exports.template = function(grunt, init, done) {

  init.process({type: 'jquery'}, [
    // Prompt for these values.
    init.prompt('name'),
    init.prompt('title', function(value, data, done) {
      // Fix jQuery capitalization.
      value = value.replace(/jquery/gi, 'jQuery');
      done(null, value);
    }),
    init.prompt('description', 'The best jQuery plugin ever.'),
    init.prompt('version'),
    init.prompt('repository'),
    init.prompt('homepage'),
    init.prompt('bugs'),
    init.prompt('licenses', 'MIT'),
    init.prompt('author_name'),
    init.prompt('author_email'),
    init.prompt('author_url'),
    init.prompt('jquery_version')
  ], function(err, props) {
    // A few additional properties.
    //props.seajsjson = props.name + '.seajs.json';

    props.seajsjson = 'seajs.json';
    props.dependencies = {jquery: props.jquery_version || '>= 1'};

    props.keywords = [];

    // Files to copy (and process).
    var files = init.filesToCopy(props);

    // Add properly-named license files.
    init.addLicenseFiles(files, props.licenses);

    // Actually copy (and process) files.
    init.copyAndProcess(files, props, {noProcess: 'libs/**'});
	var output = {};
	output[props.name+".js"] = [props.name+".js"];
    // Generate package.json file, used by npm and grunt.
    init.writePackageJSON('package.json', {
      name: props.name,
      version: '0.1.0',
      npm_test: 'grunt qunit',
      // TODO: pull from grunt's package.json
      node_version: '>= 0.8.0',
      devDependencies: {
        'grunt-contrib-jshint': '~0.1.1',
        'grunt-contrib-qunit': '~0.1.1',
        'grunt-contrib-concat': '~0.1.2',
        'grunt-contrib-uglify': '~0.1.1',
        'grunt-contrib-watch': '~0.2.0',
        'grunt-contrib-clean': '~0.4.0',
      },
    });

    // Generate seajs.json file.
    init.writePackageJSON(props.seajsjson, props, function(pkg, props) {
      // The jQuery site needs the "bugs" value as a string.
      if ('bugs' in props) { pkg.bugs = props.bugs; }
      return pkg;
    });

    // All done!
    done();
  });

};
