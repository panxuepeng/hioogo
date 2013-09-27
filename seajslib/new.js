var shell = require('shelljs');
var _s = require('underscore.string');
var pwd = shell.pwd();

shell.echo('\n请输入要创建的组件名称:');
process.stdin.resume(); // 获取用户输入
process.stdin.on('data', function( name ) {
	// 注意：
	// 接受到的数据，必须进行trim处理
	// 否则尾部会有"\n"，导致shell.mkdir执行失败
	name = _s.trim(name).toLowerCase();
	shell.mkdir('./'+name);
	shell.echo('mkdir '+ name);
	shell.cd(name);
	
	// 这里还是有点问题
	shell.exec('grunt-init ../module-tpl', {async:true})
})


