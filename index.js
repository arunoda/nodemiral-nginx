var nodemiral = require('nodemiral');
var path = require('path');

/*
  vars: vars for the paramters, following fields are containing
    no fileds for now - needs no input
*/
exports.install = function(vars, taskListOptions) {
  var taskList = nodemiral.taskList('Nginx Installation', taskListOptions);
  taskList.executeScript('install', {
    script: path.resolve(__dirname, 'scripts/install.sh')
  });

  return taskList;
};

/*
  vars: vars for the paramters, following fields are containing
    nodes: ['nodehost1', 'nodehost2']
*/
exports.configure = function(vars, taskListOptions) {
  var taskList = nodemiral.taskList('HaProxy Configuration', taskListOptions);

  taskList.copy('upstart', {
    src: path.resolve(__dirname, 'templates/nginx.init.conf'),
    dest: '/etc/init/nginx.conf'
  });

  taskList.copy('nginx-config', {
    src: path.resolve(__dirname, 'templates/nginx.conf'),
    dest: '/opt/nginx/conf/nginx.conf',
    vars: vars
  });

  //restart haproxy
  taskList.execute('restarting-nginx', {
    command: '(sudo stop nginx || :) && (sudo start nginx || :)'
  });

  return taskList;
};

/*
  vars: vars for the paramters, following fields are containing
    no fileds for now - needs no input
*/
exports.start = function(vars, taskListOptions) {
  var taskList = nodemiral.taskList('Start Nginx', taskListOptions);

  taskList.execute('start', {
    command: 'sudo start nginx || :'
  });

  return taskList;
};

/*
  vars: vars for the paramters, following fields are containing
    no fileds for now - needs no input
*/
exports.stop = function(vars, taskListOptions) {
  var taskList = nodemiral.taskList('Stop Nginx', taskListOptions);
  taskList.execute('stop', {
    command: 'sudo stop nginx || :'
  });

  return taskList;
};
